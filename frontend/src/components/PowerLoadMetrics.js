import React from 'react';
import Card from './Card';
import ImpactMeter from './ImpactMeter';
import {
    calculatePowerLoad,
    getPowerConservationRecommendations
} from '../utils/powerLoadUtils';

/**
 * Component for displaying power load metrics and recommendations
 */
function PowerLoadMetrics({
    buildingData,
    className = '',
    showRecommendations = true,
    showBreakdown = true
}) {
    // Calculate power load metrics
    const powerLoad = calculatePowerLoad(buildingData);

    // Get power conservation recommendations
    const recommendations = showRecommendations ?
        getPowerConservationRecommendations(powerLoad) : [];

    return (
        <Card title="Power Load Analysis" className={className}>
            <div className="space-y-6">
                {/* Main metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded p-4 bg-gray-50 text-center">
                        <h4 className="text-sm text-gray-500 mb-1">Daily Demand</h4>
                        <p className="text-2xl font-bold text-power-700">
                            {powerLoad.dailyDemandKWh.toLocaleString()} kWh
                        </p>
                    </div>
                    <div className="border rounded p-4 bg-gray-50 text-center">
                        <h4 className="text-sm text-gray-500 mb-1">Monthly Demand</h4>
                        <p className="text-2xl font-bold text-power-700">
                            {powerLoad.monthlyDemandKWh.toLocaleString()} kWh
                        </p>
                    </div>
                    <div className="border rounded p-4 bg-gray-50 text-center">
                        <h4 className="text-sm text-gray-500 mb-1">Peak Demand</h4>
                        <p className="text-2xl font-bold">
                            {powerLoad.peakDemandKW.toLocaleString()} kW
                        </p>
                    </div>
                </div>

                {/* Impact meter */}
                <div>
                    <h4 className="font-medium mb-2">Impact on Local Power Grid</h4>
                    <ImpactMeter 
                        label="Grid Strain"
                        value={powerLoad.strainPercentage}
                        risk={powerLoad.riskLevel}
                    />
                    <p className="text-sm text-gray-600 mt-2">
                        This development would use approximately {powerLoad.strainPercentage}% of the available power grid capacity in the Kilimani area.
                    </p>
                </div>

                {/* Breakdown */}
                {showBreakdown && (
                    <div>
                        <h4 className="font-medium mb-2">Demand Breakdown</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border rounded p-3 bg-gray-50">
                                <h5 className="text-sm text-gray-500 mb-1">Residential Units</h5>
                                <p className="font-semibold">
                                    {powerLoad.breakdown.unitBasedDemand.toLocaleString()} kWh/day
                                </p>
                                <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                                    <div 
                                        className="h-2 bg-power-500 rounded-full"
                                        style={{
                                            width: `${(powerLoad.breakdown.unitBasedDemand / powerLoad.dailyDemandKWh) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="border rounded p-3 bg-gray-50">
                                <h5 className="text-sm text-gray-500 mb-1">Common Areas</h5>
                                <p className="font-semibold">
                                    {powerLoad.breakdown.commonAreasDemand.toLocaleString()} kWh/day
                                </p>
                                <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                                    <div 
                                        className="h-2 bg-power-500 rounded-full"
                                        style={{
                                            width: `${(powerLoad.breakdown.commonAreasDemand / powerLoad.dailyDemandKWh) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="border rounded p-3 bg-gray-50">
                                <h5 className="text-sm text-gray-500 mb-1">Amenities</h5>
                                <p className="font-semibold">
                                    {powerLoad.breakdown.amenitiesDemand.toLocaleString()} kWh/day
                                </p>
                                <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                                    <div 
                                        className="h-2 bg-power-500 rounded-full"
                                        style={{
                                            width: `${(powerLoad.breakdown.amenitiesDemand / powerLoad.dailyDemandKWh) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recommendations */}
                {showRecommendations && recommendations.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-2">Power Conservation Recommendations</h4>
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

export default PowerLoadMetrics;