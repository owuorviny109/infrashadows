import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/Container';
import GreenCoverCalculator from '../components/GreenCoverCalculator';
import Button from '../components/Button';

function GreenCoverPage() {
  return (
    <Container>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Green Cover Loss Analysis</h1>
          <p className="text-gray-600">
            Calculate the environmental impact of vegetation loss for a development
          </p>
        </div>
        <div className="flex space-x-2">
          <Link to="/analysis">
            <Button variant="outline">Back to Analysis</Button>
          </Link>
        </div>
      </div>
      
      <div className="mb-6">
        <GreenCoverCalculator />
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-green-800 mb-2">About Green Cover Loss Analysis</h3>
        <p className="text-green-700 mb-2">
          This tool estimates the environmental impact of vegetation loss for a development based on:
        </p>
        <ul className="list-disc pl-5 text-green-700 space-y-1">
          <li>Pre-development vegetation coverage and types</li>
          <li>Post-development vegetation coverage and types</li>
          <li>Carbon sequestration capacity</li>
          <li>Biodiversity impact</li>
          <li>Urban heat island effect</li>
        </ul>
        <p className="text-green-700 mt-2">
          The analysis helps identify potential environmental impacts and provides recommendations for mitigating green cover loss.
        </p>
      </div>
    </Container>
  );
}

export default GreenCoverPage;