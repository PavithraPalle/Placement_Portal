import React, { useState } from 'react';
import axios from 'axios';
import { GraduationCap, Filter, Users, TrendingUp, Download, RefreshCw, Search, X, ChevronDown, Sparkles, Award, Target } from 'lucide-react';

const PlacementFilterPortal = () => {
  const [filters, setFilters] = useState({
    minTenthPercentage: 60,
    minTwelfthPercentage: 60,
    minUgPercentage: 65,
    maxBacklogs: 0,
    gender: 'Both'
  });

  const [showFilters, setShowFilters] = useState(true);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/students/filter-eligible',
        filters
      );

      setEligibleStudents(res.data.data || []);
      setStats(res.data.stats || null);
      setShowFilters(false);
    } catch (err) {
      console.error(err);
      setError('Failed to filter students. Please check your connection and backend API.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      minTenthPercentage: 60,
      minTwelfthPercentage: 60,
      minUgPercentage: 65,
      maxBacklogs: 0,
      gender: 'Both'
    });
    setEligibleStudents([]);
    setStats(null);
    setShowFilters(true);
    setError('');
  };

  const exportToCSV = () => {
    const headers = [
      'Roll No','Name','Gender','Date of Birth','10th %','12th %',
      'B.Tech %','Backlogs','Personal Email','Domain Email','Contact'
    ];

    const csvData = eligibleStudents.map(s => [
      s.rollNumber,
      s.studentName,
      s.gender,
      new Date(s.dateOfBirth).toLocaleDateString(),
      s.sscPercentage,
      s.interPercentage,
      s.btechPercentage,
      s.backlogCount,
      s.personalEmail,
      s.domainEmail,
      s.contactNumber
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eligible_students_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, rgb(46, 16, 101), rgb(88, 28, 135), rgb(162, 28, 175))',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Animated background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          top: 0, left: '25%',
          width: '24rem', height: '24rem',
          background: 'rgba(168, 85, 247, 0.2)',
          borderRadius: '9999px', filter: 'blur(80px)',
          animation: 'pulse 3s ease-in-out infinite'
        }} />
      </div>

      <div style={{ maxWidth: '80rem', margin: '0 auto', position: 'relative', zIndex: 10 }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(to right, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          marginBottom: '2rem',
          backdropFilter: 'blur(25px)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <GraduationCap size={45} color="white" />
              <div>
                <h1 style={{ fontSize: '2.5rem', color: 'white', fontWeight: 900 }}>
                  Placement Drive Portal
                </h1>
                <p style={{ color: '#EBD9FF' }}>Filter and manage candidates</p>
              </div>
            </div>

            {!showFilters && (
              <button
                onClick={() => setShowFilters(true)}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(to right, #A855F7, #D946EF)',
                  color: 'white',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Show Filters
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.9)',
            padding: '1rem',
            color: 'white',
            borderRadius: '1rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div style={{
            background: 'white',
            borderRadius: '1.5rem',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1.5rem' }}>
              Eligibility Criteria
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
              gap: '1.5rem'
            }}>

              <input name="minTenthPercentage" type="number" value={filters.minTenthPercentage} onChange={handleInputChange} placeholder="Minimum 10th %" />
              <input name="minTwelfthPercentage" type="number" value={filters.minTwelfthPercentage} onChange={handleInputChange} placeholder="Minimum 12th %" />
              <input name="minUgPercentage" type="number" value={filters.minUgPercentage} onChange={handleInputChange} placeholder="Minimum UG %" />
              <input name="maxBacklogs" type="number" value={filters.maxBacklogs} onChange={handleInputChange} placeholder="Max Backlogs" />

              <select name="gender" value={filters.gender} onChange={handleInputChange}>
                <option>Both</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={handleFilterStudents} disabled={loading}
                style={{ padding: '1rem 2rem', background: '#9333EA', color: 'white', borderRadius: '1rem', border: 'none' }}>
                {loading ? 'Filtering...' : 'Filter Students'}
              </button>

              <button onClick={handleReset}
                style={{ padding: '1rem 2rem', background: '#E5E7EB', borderRadius: '1rem', border: 'none' }}>
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {!showFilters && stats && (
          <>
            {/* Stats cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem' }}>
                Total Eligible: {stats.totalEligible}
              </div>
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem' }}>
                Avg B.Tech %: {stats.avgBtechPercentage}
              </div>
            </div>

            {/* Table */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem' }}>
              {eligibleStudents.length === 0 ? (
                <p>No eligible students found.</p>
              ) : (
                <table style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Gender</th>
                      <th>B.Tech %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eligibleStudents.map((s, i) => (
                      <tr key={i}>
                        <td>{s.rollNumber}</td>
                        <td>{s.studentName}</td>
                        <td>{s.gender}</td>
                        <td>{s.btechPercentage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <button onClick={exportToCSV}
                style={{ marginTop: '1rem', padding: '1rem 2rem', background: 'green', color: 'white', borderRadius: '1rem', border: 'none' }}>
                Export CSV
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse {0%,100%{opacity:1;}50%{opacity:.5;}}
      `}</style>
    </div>
  );
};

export default PlacementFilterPortal;
