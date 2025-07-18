import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/Container';
import DrainageImpactCalculator from '../components/DrainageImpactCalculator';
import Button from '../components/Button';

function DrainageImpactPage() {
  return (
    <Container>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Drainage Impact Analysis</h1>
          <p className="text-gray-600">
            Calculate the runoff and drainage system strain for a development
          </p>
        </div>
        <div className="flex space-x-2">
          <Link to="/analysis">
            <Button variant="outline">Back to Analysis</Button>
          </Link>
        </div>
      </div>
      
      <div className="mb-6">
        <DrainageImpactCalculator />
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-green-800 mb-2">About Drainage Impact Analysis</h3>
        <p className="text-green-700 mb-2">
          This tool estimates the drainage impact and runoff for a development based on:
        </p>
        <ul className="list-disc pl-5 text-green-700 space-y-1">
          <li>Plot size and building footprint</li>
          <li>Surface types and their water absorption properties</li>
          <li>Local rainfall patterns in Kilimani</li>
          <li>Drainage system capacity</li>
        </ul>
        <p className="text-green-700 mt-2">
          The analysis helps identify potential strain on the local drainage system and provides recommendations for reducing runoff and preventing flooding.
        </p>
      </div>
    </Container>
  );
}

export default DrainageImpactPage;