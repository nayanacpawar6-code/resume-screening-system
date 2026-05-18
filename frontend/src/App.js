import React, { useState } from 'react';
import './App.css';

function App() {

  const [jobDescription, setJobDescription] = useState('');

  const [resumes, setResumes] = useState([]);

  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append(
      'job_description',
      jobDescription
    );

    for (let i = 0; i < resumes.length; i++) {

      formData.append(
        'resumes',
        resumes[i]
      );
    }

    const response = await fetch(
      'https://resume-screening-system-7j98.onrender.com/analyze',
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await response.json();

    setResults(data);
  };

  return (

    <div className='container'>

      <h1>
        Resume Screening System
      </h1>

      <form onSubmit={handleSubmit}>

        <textarea
          placeholder='Enter Job Description'
          value={jobDescription}
          onChange={(e) =>
            setJobDescription(e.target.value)
          }
        />

        <br /><br />

        <input
          type='file'
          multiple
          onChange={(e) =>
            setResumes(e.target.files)
          }
        />

        <br /><br />

        <button type='submit'>
          Analyze Resumes
        </button>

      </form>

      <h2>Results</h2>

      <table border='1' cellPadding='10'>

        <thead>

          <tr>
            <th>Candidate</th>
            <th>Match Score</th>
          </tr>

        </thead>

        <tbody>

          {results.map((result, index) => (

            <tr key={index}>

              <td>
                {result.candidate}
              </td>

              <td>
                {result.score}%
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default App;