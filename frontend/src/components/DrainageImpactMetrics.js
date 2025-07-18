import React from 'react';
import Card from './Card';
import ImpactMeter from './ImpactMeter';
import {
    calculateDrainageImpact,
    getDrainageMitigationRecommendations
} from '../utils/drainageImpactUtils';

/**
 * Component for displaying drainage impact metrics and recommendations
 */
function DrainageImpactMetrics({
    buildingData,
    className = '',
    showRecommendations = true,
    showBreakdown = true
}) {
    // Calculate drainage impact metrics
    const drainageImpact = calculateDrainageImpact(buildingData);

    // Get drainage mitigation recommendations
    const recommendations = showRecommendations ?
        getDrainageMitigationRecommendations(drainageImpact) : [];

    return (
        <Card title="Drainage Impact Analysis" className={className}>
            <div className="space-y-6">
                {/* Main metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded p-4 bg-gray-50 text-center">
                        <h4 className="text-sm text-gray-500 mb-1">Annual Runoff</h4>
                        <p className="text-2xl font-bold text-drainage-700">
                            {(drainageImpact.annualRunoffLiters / 1000).toLocaleString()} m³
                        </p>
                    </div>
                    <div className="border rounded p-4 bg-gray-50 text-center">
                        <h4 className="text-sm text-gray-500 mb-1">Peak Runoff</h4>
                        <p className="text-2xl font-bold text-drainage-700">
                            {drainageImpact.peakRunoffLitersPerSecond.toLocaleString()} L/s
                        </p>
                    </div>
                    <div className="border rounded p-4 bg-gray-50 text-center">
                        <h4 className="text-sm text-gray-500 mb-1">Flood Risk</h4>
                        <p className="text-2xl font-bold">
                            {drainageImpact.floodRisk}
                        </p>
                    </div>
                </div>

                {/* Impact meter */}
                <div>
                    <h4 className="font-medium mb-2">Impact on Local Drainage System</h4>
                    <ImpactMeter 
                        label="Drainage Strain"
                        value={drainageImpact.strainPercentage}
                        risk={drainageImpact.riskLevel}
                    />
                    <p className="text-sm text-gray-600 mt-2">
                        This development would use approximately {drainageImpact.strainPercentage}% of the available drainage capacity in the Kilimani area.
                    </p>
                </div>

                {/* Breakdown */}
                {showBreakdown && (
                    <div>
                        <h4 className="font-medium mb-2">Runoff Breakdown</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border rounded p-3 bg-gray-50">
                                <h5 className="text-sm text-gray-500 mb-1">Pre-Development Runoff</h5>
                                <p className="font-semibold">
                                    {(drainageImpact.preDevelopmentRunoffLiters / 1000).toLocaleString()} m³/year
                                </p>
                                <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                                    <div 
                                        className="h-2 bg-drainage-500 rounded-full"
                                        style={{
                                            width: `${(drainageImpact.preDevelopmentRunoffLiters / drainageImpact.annualRunoffLiters) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="border rounded p-3 bg-gray-50">
                                <h5 className="text-sm text-gray-500 mb-1">Additional Runoff</h5>
                                <p className="font-semibold">
                                    {(drainageImpact.additionalRunoffLiters / 1000).toLocaleString()} m³/year
                                </p>
                                <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                                    <div 
                                        className="h-2 bg-drainage-500 rounded-full"
                                        style={{
                                            width: `${(drainageImpact.additionalRunoffLiters / drainageImpact.annualRunoffLiters) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        
                        <h4 className="font-medium mb-2 mt-4">Surface Area Distribution</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(drainageImpact.surfaceAreas).map(([surfaceType, area]) => (
                                <div key={surfaceType} className="border rounded p-3 bg-gray-50">
                                    <h5 className="text-sm text-gray-500 mb-1 capitalize">{surfaceType.replace('_', ' ')}</h5>
                                    <p className="font-semibold">
                                        {area.toLocaleString()} m² ({Math.round((area / drainageImpact.totalArea) * 100)}%)
                                    </p>
                                    <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                                        <div 
                                            className="h-2 bg-drainage-500 rounded-full"
                                            style={{
                                                width: `${(area / drainageImpact.totalArea) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommendations */}
                {showRecommendations && recommendations.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-2">Drainage Mitigation Recommendations</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            {recommendations.map((recommendation, index) => (
                                <li key={index} className="text-sm">{recommendation}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </Card>
    );
}

export default DrainageImpactMetrics;