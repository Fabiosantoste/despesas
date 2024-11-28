import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SummaryScreen({ route }) {
  const { month } = route.params;
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const storedData = await AsyncStorage.getItem(month);
      const tasks = storedData ? JSON.parse(storedData) : [];
      
      const groupedData = tasks.reduce((acc, task) => {
        if (!acc[task.category]) acc[task.category] = 0;
        acc[task.category] += parseFloat(task.value || 0);
        return acc;
      }, {});

      const formattedData = Object.keys(groupedData).map((key) => ({
        name: key,
        value: groupedData[key],
        color: getRandomColor(),
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      }));

      setChartData(formattedData);
    };

    fetchData();
  }, [month]);

  
  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo de {month}</Text>
      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text style={styles.noDataText}>Nenhum dado disponível para {month}.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  noDataText: { fontSize: 16, textAlign: 'center', marginTop: 50, color: '#999' },
});
