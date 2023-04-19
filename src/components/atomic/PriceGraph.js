// React imports
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, StyleSheet, View } from 'react-native';
import { Button, StandardButton, FixedWidthButton, Spinner } from 'src/components/atomic';
import { Dimensions, Platform, PixelRatio } from 'react-native';

import { LineChart } from 'react-native-chart-kit'


let PriceGraph = ({assetBA, assetQA, period, historic_prices}) => {
    console.log(">>>> "+JSON.stringify(assetBA));
    console.log(">>>> "+JSON.stringify(assetQA));
    console.log(">>>> "+period);
    console.log(">>>> "+historic_prices);

 function  getlinedata({assetBA, assetQA, peiod}) {
    let market = assetBA+ '/' + assetQA;
    let data = [];
    console.log(assetBA);
    console.log(assetQA);
    console.log(historic_prices);

    if(historic_prices[market]!=null &&
       historic_prices[market][period]!=null)
    {
      // We have data for the requested market and period - display it.
      historic_prices['current'] = historic_prices[market][period];
    }
    else
    {
      // No data for the requested period - set to 'blank'
      historic_prices['current'] = [1,1];
    }
    linedata = {
      labels: ['', '00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00',''],
      datasets: [
        {
          data: historic_prices['current'],
          strokeWidth: 2, // optional
        },
      ],
    };
    return linedata;
  }



  function getPriceDP({assetBA, assetQA, period}) {
//    log(`getPriceDP ${assetBA} ${assetQA} ${period}`);
    //appState.apiData.historic_prices["BTC/GBP"]["1D"]
    let market = assetBA+'/'+assetQA;
//    log("X = "+market);
//    log("X = "+JSON.stringify(appState.apiData.historic_prices[market]));
    // If we've got no prices currently then fallback to a guestimate based on the market.
    if(historic_prices[market]==undefined ||
      historic_prices[market][period]==undefined) {
      let marketDP = {
        "BTC/GBP": 0,
        "LTC/GBP": 2,
        "XRP/GBP": 4,
        "ETH/GBP": 0,
        "LINK/GBP": 2,
      }
      if(market in marketDP) {
        return marketDP[market];
      } else {
        return 2;
      }
    }
    let assetPrice = historic_prices[market][period][0]
    if(assetPrice>100) {
      return 0;
    }
    if(assetPrice>1) {
      return 2;
    }
    if(assetPrice>0.1) {
      return 4;
    }
    if(assetPrice>0.01) {
      return 5;
    }
    if(assetPrice>0.001) {
      return 6;
    }
    return 8;
  }

  return (
  <LineChart
    data={getlinedata({assetBA, assetQA, period})}
    width={Dimensions.get('window').width * 0.9}
    //width={100 * horizontalScale} // from react-native
    height={220}
    yAxisLabel={'£'}
//    yLabelsOffset={-50}
    xLabelsOffset={+10}
    horizontalOffset={30}
    verticalLabelRotation={-45}
    withHorizontalLabels={true}
    withVerticalLabels={false}
    chartConfig={{
      backgroundColor: '#ff0000',
      fillShadowGradientFrom: '#000000',
      fillShadowGradientFromOpacity: '0.3',
      fillShadowGradientTo:   '#FFFFFF',
      fillShadowGradientToOffset: '200',
      fillShadowGradientToOpacity: '0',
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo:   '#ffffff',
      decimalPlaces:getPriceDP({assetBA, assetQA, period}),
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

      yLabelsOffset: "50",
        propsForHorizontalLabels: {
            dx: 60 
        },      
      propsForBackgroundLines: {
        strokeWidth: "0",
      },
      propsForDots: {
        r: "0",
        strokeWidth: "1",
        stroke: "#000000"
      },
      style: {
        marginVertical: 80,
        borderRadius: 16,
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      marginHorizontal: 0,
      paddingHorizontal: 0,
      borderHorizontal: 200,
      borderRadius: 30,
     paddingRight: 0,

    }}
  /> 
  );
}


export default PriceGraph;