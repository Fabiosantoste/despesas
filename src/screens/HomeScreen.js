import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState({});
  

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];


  const loadExpenses = async () => {
    try {

      const storedExpenses = {};
      for (let month of months) {
        const monthExpenses = await AsyncStorage.getItem(`@expenses_${month}`);
        if (monthExpenses) {
          storedExpenses[month] = JSON.parse(monthExpenses);
        } else {
          storedExpenses[month] = [];
        }
      }
      setExpenses(storedExpenses);
    } catch (error) {
      console.error('Erro ao carregar despesas', error);
    }
  };


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadExpenses();
    });

    return unsubscribe; 
  }, [navigation]);


  const renderMonth = ({ item }) => (
    <TouchableOpacity
      style={styles.monthCard}
      onPress={() => navigation.navigate('MonthDetails', { month: item })}
    >
      <Ionicons name="calendar-outline" size={32} color="#5A5AFF" />
      <Text style={styles.monthText}>{item}</Text>
      <Text style={styles.expenseCount}>
        {expenses[item] && expenses[item].length > 0
          ? `${expenses[item].length} despesas`
          : 'Sem despesas'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Selecione um Mês</Text>
      <FlatList
        data={months}
        renderItem={renderMonth}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#4E4E4E',
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  monthCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  monthText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#5A5AFF',
  },
  expenseCount: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '400',
    color: '#4E4E4E',
  },
});

export default HomeScreen;
