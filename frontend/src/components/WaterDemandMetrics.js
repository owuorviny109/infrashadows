import React from 'react';
import Card from './Card';
import ImpactMeter from './ImpactMeter';
import {
    calculateWaterDemand,
    getWaterConservationRecommendations
} from '../utils/waterDemandUtils';

/**
 * Component for displaying water demand metrics and recommendations
 */
function WaterDemandMetrics({
    buildingData,
    className = '',
    showRecommendations = true,
    showBreakdown = true
}) {
    // Calculate water demand metrics
    const waterDemand = calculateWaterDemand(buildingData);

    // Get water conservation recommendations
    const recommendations = showRecommendations ?
        getWaterConservationRecommendations(waterDemand) : [];

    return ( <
        Card title = "Water Demand Analysis"
        className = {
            className
        } >
        <
        div className = "space-y-6" > {
            /* Main metrics */ } <
        div className = "grid grid-cols-1 md:grid-cols-3 gap-4" >
        <
        div className = "border rounded p-4 bg-gray-50 text-center" >
        <
        h4 className = "text-sm text-gray-500 mb-1" > Daily Demand < /h4> <
        p className = "text-2xl font-bold text-water-700" > {
            waterDemand.dailyDemandLiters.toLocaleString()
        }
        L <
        /p> <
        /div> <
        div className = "border rounded p-4 bg-gray-50 text-center" >
        <
        h4 className = "text-sm text-gray-500 mb-1" > Monthly Demand < /h4> <
        p className = "text-2xl font-bold text-water-700" > {
            waterDemand.monthlyDemandCubicMeters.toLocaleString()
        }
        m³ <
        /p> <
        /div> <
        div className = "border rounded p-4 bg-gray-50 text-center" >
        <
        h4 className = "text-sm text-gray-500 mb-1" > Estimated Occupancy < /h4> <
        p className = "text-2xl font-bold" > {
            waterDemand.estimatedOccupancy.toLocaleString()
        }
        people <
        /p> <
        /div> <
        /div>

        {
            /* Impact meter */ } <
        div >
        <
        h4 className = "font-medium mb-2" > Impact on Local Water Supply < /h4> <
        ImpactMeter label = "Water Strain"
        value = {
            waterDemand.strainPercentage
        }
        risk = {
            waterDemand.riskLevel
        }
        /> <
        p className = "text-sm text-gray-600 mt-2" >
        This development would use approximately {
            waterDemand.strainPercentage
        } % of the available water supply capacity in the Kilimani area. <
        /p> <
        /div>

        {
            /* Breakdown */ } {
            showBreakdown && ( <
                div >
                <
                h4 className = "font-medium mb-2" > Demand Breakdown < /h4> <
                div className = "grid grid-cols-1 md:grid-cols-3 gap-4" >
                <
                div className = "border rounded p-3 bg-gray-50" >
                <
                h5 className = "text-sm text-gray-500 mb-1" > Residential Units < /h5> <
                p className = "font-semibold" > {
                    waterDemand.breakdown.unitBasedDemand.toLocaleString()
                }
                L / day <
                /p> <
                div className = "h-2 w-full bg-gray-200 rounded-full mt-1" >
                <
                div className = "h-2 bg-water-500 rounded-full"
                style = {
                    {
                        width: `${(waterDemand.breakdown.unitBasedDemand / waterDemand.dailyDemandLiters) * 100}%`
                    }
                } >
                < /div> <
                /div> <
                /div> <
                div className = "border rounded p-3 bg-gray-50" >
                <
                h5 className = "text-sm text-gray-500 mb-1" > Common Areas < /h5> <
                p className = "font-semibold" > {
                    waterDemand.breakdown.commonAreasDemand.toLocaleString()
                }
                L / day <
                /p> <
                div className = "h-2 w-full bg-gray-200 rounded-full mt-1" >
                <
                div className = "h-2 bg-water-500 rounded-full"
                style = {
                    {
                        width: `${(waterDemand.breakdown.commonAreasDemand / waterDemand.dailyDemandLiters) * 100}%`
                    }
                } >
                < /div> <
                /div> <
                /div> <
                div className = "border rounded p-3 bg-gray-50" >
                <
                h5 className = "text-sm text-gray-500 mb-1" > Amenities < /h5> <
                p className = "font-semibold" > {
                    waterDemand.breakdown.amenitiesDemand.toLocaleString()
                }
                L / day <
                /p> <
                div className = "h-2 w-full bg-gray-200 rounded-full mt-1" >
                <
                div className = "h-2 bg-water-500 rounded-full"
                style = {
                    {
                        width: `${(waterDemand.breakdown.amenitiesDemand / waterDemand.dailyDemandLiters) * 100}%`
                    }
                } >
                < /div> <
                /div> <
                /div> <
                /div> <
                /div>
            )
        }

        {
            /* Recommendations */ } {
            showRecommendations && recommendations.length > 0 && ( <
                div >
                <
                h4 className = "font-medium mb-2" > Water Conservation Recommendations < /h4> <
                ul className = "list-disc pl-5 space-y-1" > {
                    recommendations.map((recommendation, index) => ( <
                        li key = {
                            index
                        }
                        className = "text-sm" > {
                            recommendation
                        } < /li>
                    ))
                } <
                /ul> <
                /div>
            )
        } <
        /div> <
        /Card>
    );
}

export default WaterDemandMetrics;