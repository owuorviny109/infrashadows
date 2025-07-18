import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../components/Container';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import WaterDemandMetrics from '../components/WaterDemandMetrics';
import { useAppContext } from '../context/AppContext';

function WaterDemandPage() {
  const { id } = useParams();
  const { developments } = useAppContext();
  
  // Find the development by ID
  const development = developments.find(dev => dev.id === id);
  
  if (!development) {
    return (
      <Container>
        <Alert type="error" className="my-4">
          Development not found. Please analyze a development first.
        </Alert>
        <div className="text-center mt-4">
          <Link to="/analysis">
            <Button variant="primary">Go to Analysis</Button>
          </Link>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Water Demand Analysis</h1>
        <div className="flex space-x-2">
          <Link to={`/report/${id}`}>
            <Button variant="outline">
              Back to Report
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WaterDemandMetrics 
            buildingData={development.extractedData}
            showRecommendations={true}
            showBreakdown={true}
          />
          
          <Card title="Water Conservation Strategies" className="mt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Rainwater Harvesting</h3>
                <p className="text-sm">
                  Implementing a rainwater harvesting system could reduce municipal water demand by up to 30% 
                  in this development. Based on the roof area and Nairobi's average annual rainfall of 1,000mm, 
                  this development could collect approximately {Math.round(development.extractedData.units * 50 * 1000)} 
                  liters of water per year.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Water-Efficient Fixtures</h3>
                <p className="text-sm">
                  Installing low-flow fixtures throughout the development could reduce water consumption by 15-20%. 
                  This includes low-flow showerheads (6-8 liters per minute instead of 15-20), dual-flush toilets 
                  (3/6 liters per flush instead of 13), and faucet aerators (2-4 liters per minute instead of 8-10).
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Greywater Recycling</h3>
                <p className="text-sm">
                  A greywater recycling system could reduce water demand by up to 35%. Greywater from showers, 
                  bathroom sinks, and washing machines can be treated and reused for toilet flushing, irrigation, 
                  and cleaning purposes.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Smart Water Metering</h3>
                <p className="text-sm">
                  Installing individual water meters for each unit can reduce consumption by 15-20% through 
                  increased awareness and accountability. Smart meters can also detect leaks early, preventing 
                  water waste.
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <Card title="Development Details">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm text-gray-500">Building</h3>
                <p className="font-semibold">{development.extractedData.developmentName || 'Unnamed Development'}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Location</h3>
                <p className="font-semibold">{development.extractedData.location}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Floors</h3>
                <p className="font-semibold">{development.extractedData.floors}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Units</h3>
                <p className="font-semibold">{development.extractedData.units}</p>
              </div>
              {development.extractedData.parkingSpaces && (
                <div>
                  <h3 className="text-sm text-gray-500">Parking Spaces</h3>
                  <p className="font-semibold">{development.extractedData.parkingSpaces}</p>
                </div>
              )}
              {development.extractedData.amenities && development.extractedData.amenities.length > 0 && (
                <div>
                  <h3 className="text-sm text-gray-500">Amenities</h3>
                  <ul className="list-disc pl-5">
                    {development.extractedData.amenities.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
          
          <Card title="Water Supply Context" className="mt-6">
            <div className="space-y-4">
              <p className="text-sm">
                Kilimani area in Nairobi faces water supply challenges due to rapid urbanization and 
                infrastructure limitations. The area is served by the Nairobi Water and Sewerage Company, 
                which has a limited supply capacity.
              </p>
              <div>
                <h3 className="font-semibold text-sm">Local Supply Capacity</h3>
                <p className="text-sm">2,000,000 liters per day</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Current Utilization</h3>
                <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                  <div 
                    className="h-2 bg-water-500 rounded-full" 
                    style={{ width: '65%' }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">65% of capacity used by existing developments</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Water Availability</h3>
                <p className="text-sm">
                  Water rationing is common in the area, with most neighborhoods receiving water 2-3 days per week. 
                  New developments are required to install water storage tanks with capacity for at least 3 days 
                  of consumption.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default WaterDemandPage;