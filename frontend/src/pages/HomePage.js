import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/Container';
import Card from '../components/Card';
import Button from '../components/Button';

function HomePage() {
  return (
    <Container>
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">InfraShadows</h1>
        <p className="text-xl mb-8">
          Visualizing the hidden infrastructure impacts of urban development in Nairobi's Kilimani area
        </p>
        <Link to="/analysis">
          <Button variant="primary" size="lg">
            Start Analysis
          </Button>
        </Link>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
        <Card title="Infrastructure Impact">
          <p>Analyze how new developments affect water, power, drainage, and green spaces.</p>
          <div className="mt-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-water-500 opacity-30 flex items-center justify-center">
              <svg className="w-8 h-8 text-water-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </Card>
        <Card title="Zoning Compliance">
          <p>Check if developments comply with local zoning regulations and requirements.</p>
          <div className="mt-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-zoning-500 opacity-30 flex items-center justify-center">
              <svg className="w-8 h-8 text-zoning-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </Card>
        <Card title="Legitimacy Scoring">
          <p>Get an overall legitimacy score based on multiple factors and regulations.</p>
          <div className="mt-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-drainage-500 opacity-30 flex items-center justify-center">
              <svg className="w-8 h-8 text-drainage-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            </div>
          </div>
        </Card>
      </section>
      
      <section className="my-12 bg-secondary-50 p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Input Development Details</h3>
            <p className="text-sm">Enter real estate listing information or development specifications</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-sm">Our system analyzes the impact on infrastructure and compliance</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Visualize Impact</h3>
            <p className="text-sm">See the development's impact shadows on an interactive map</p>
          </div>
        </div>
      </section>
    </Container>
  );
}

export default HomePage;