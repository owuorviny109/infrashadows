import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../components/Container';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import LegitimacyScore from '../components/LegitimacyScore';
import ImpactMeter from '../components/ImpactMeter';
import Alert from '../components/Alert';

function ReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch report data
    setTimeout(() => {
      setReport({
        id: id,
        developmentName: 'Sample Development',
        location: 'Kilimani, Nairobi',
        date: new Date().toLocaleDateString(),
        legitimacyScore: 78,
        infrastructureImpact: {
          water: { score: 65, risk: 'Medium' },
          power: { score: 72, risk: 'Low' },
          drainage: { score: 45, risk: 'High' },
          greenCover: { score: 60, risk: 'Medium' }
        },
        zoningCompliance: {
          compliant: false,
          violations: [
            { type: 'Height', description: 'Exceeds maximum allowed height by 2 floors' },
            { type: 'Density', description: 'Unit density exceeds zoning limits' }
          ]
        },
        participationAudit: {
          publicHearingHeld: true,
          nemaApproval: true,
          communityFeedbackIncorporated: false
        }
      });
      setLoading(false);
    }, 1500);
  }, [id]);

  if (loading) {
    return (
      <Container>
        <div className="flex flex-col justify-center items-center h-64">
          <Loader size="lg" className="mb-4" />
          <p className="text-lg">Loading report...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert type="error" className="my-4">
          {error}
        </Alert>
        <div className="text-center mt-4">
          <Link to="/analysis">
            <Button variant="primary">Return to Analysis</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Development Report</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            Share Report
          </Button>
          <Button>
            Download PDF
          </Button>
        </div>
      </div>
      
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div>
            <h2 className="text-2xl font-bold">{report.developmentName}</h2>
            <p className="text-gray-600">{report.location}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-gray-600">Report ID: {report.id}</p>
            <p className="text-sm text-gray-600">Generated: {report.date}</p>
          </div>
        </div>
        
        <div className="mb-6 border-t pt-4">
          <h3 className="text-xl font-semibold mb-2">Legitimacy Score</h3>
          <LegitimacyScore score={report.legitimacyScore} />
        </div>
        
        <div className="mb-6 border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold">Infrastructure Impact</h3>
            <div className="flex flex-wrap gap-2">
              <Link to={`/water-demand/${id}`}>
                <Button variant="outline" size="sm">
                  Water Analysis
                </Button>
              </Link>
              <Link to={`/power-load/${id}`}>
                <Button variant="outline" size="sm">
                  Power Analysis
                </Button>
              </Link>
              <Link to={`/drainage-impact/${id}`}>
                <Button variant="outline" size="sm">
                  Drainage Analysis
                </Button>
              </Link>
              <Link to={`/green-cover/${id}`}>
                <Button variant="outline" size="sm">
                  Green Cover Analysis
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(report.infrastructureImpact).map(([key, value]) => (
              <ImpactMeter 
                key={key} 
                label={key} 
                value={value.score} 
                risk={value.risk} 
              />
            ))}
          </div>
        </div>
        
        <div className="mb-6 border-t pt-4">
          <h3 className="text-xl font-semibold mb-2">Zoning Compliance</h3>
          {report.zoningCompliance.compliant ? (
            <Alert type="success">
              This development complies with all zoning regulations.
            </Alert>
          ) : (
            <div>
              <Alert type="error" className="mb-3">
                This development has zoning violations.
              </Alert>
              <ul className="list-disc pl-5">
                {report.zoningCompliance.violations.map((violation, index) => (
                  <li key={index} className="mb-1">
                    <strong>{violation.type}:</strong> {violation.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-xl font-semibold mb-2">Public Participation</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className={`inline-block w-5 h-5 rounded-full mr-2 ${
                report.participationAudit.publicHearingHeld ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              Public Hearing
            </li>
            <li className="flex items-center">
              <span className={`inline-block w-5 h-5 rounded-full mr-2 ${
                report.participationAudit.nemaApproval ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              NEMA Approval
            </li>
            <li className="flex items-center">
              <span className={`inline-block w-5 h-5 rounded-full mr-2 ${
                report.participationAudit.communityFeedbackIncorporated ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              Community Feedback Incorporated
            </li>
          </ul>
        </div>
      </Card>
      
      <div className="flex justify-between">
        <Link to="/analysis">
          <Button variant="outline">Back to Analysis</Button>
        </Link>
        <Link to="/map">
          <Button>View on Map</Button>
        </Link>
      </div>
    </Container>
  );
}

export default ReportPage;