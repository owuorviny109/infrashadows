import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/Container';
import PowerLoadCalculator from '../components/PowerLoadCalculator';
import Button from '../components/Button';

function PowerLoadPage() {
  return (
    <Container>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Power Load Analysis</h1>
          <p className="text-gray-600">
            Calculate the electricity demand and grid strain for a development
          </p>
        </div>
        <div className="flex space-x-2">
          <Link to="/analysis">
            <Button variant="outline">Back to Analysis</Button>
          </Link>
        </div>
      </div>
      
      <div className="mb-6">
        <PowerLoadCalculator />
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">About Power Load Analysis</h3>
        <p className="text-yellow-700 mb-2">
          This tool estimates the electricity demand and grid strain for a development based on:
        </p>
        <ul className="list-disc pl-5 text-yellow-700 space-y-1">
          <li>Number and types of residential units</li>
          <li>Common area electricity usage</li>
          <li>Amenities and their power requirements</li>
          <li>Peak demand calculations</li>
        </ul>
        <p className="text-yellow-700 mt-2">
          The analysis helps identify potential strain on the local power grid and provides recommendations for reducing electricity consumption.
        </p>
      </div>
    </Container>
  );
}

export default PowerLoadPage;