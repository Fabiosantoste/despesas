import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe AsyncStorage

const MonthDetailsScreen = ({ route, navigation }) => {
  const { month } = route.params;
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    // Aqui carregamos as despesas salvas para este mês usando AsyncStorage
    const loadExpenses = async () => {
      try {
        const savedExpenses = await AsyncStorage.getItem(`@expenses_${month}`);
        setExpenses(savedExpenses ? JSON.parse(savedExpenses) : []);
      } catch (error) {
        console.error('Erro ao carregar despesas', error);
      }
    };

    loadExpenses();
  }, [month]);

  const deleteExpense = async (id) => {
    Alert.alert(
      'Deletar Despesa',
      'Você tem certeza que deseja deletar esta despesa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              // Filtra as despesas para remover a despesa com o ID fornecido
              const updatedExpenses = expenses.filter((item) => item.id !== id);
  
              // Atualiza o estado
              setExpenses(updatedExpenses);
  
              // Salva a lista atualizada no AsyncStorage
              await AsyncStorage.setItem(`@expenses_${month}`, JSON.stringify(updatedExpenses));
  
              console.log('Despesa deletada com sucesso:', updatedExpenses);
            } catch (error) {
              console.error('Erro ao deletar a despesa:', error);
              Alert.alert('Erro', 'Não foi possível deletar a despesa.');
            }
          },
        },
      ]
    );
  };
  

  const renderExpense = ({ item }) => (
    <View style={styles.expenseCard}>
      <View>
        <Text style={styles.expenseTitle}>{item.name}</Text>
        <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
        <Text style={styles.expenseCategory}>{item.category}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddExpense', { month, expense: item })
          }
        >
          <Ionicons name="pencil-outline" size={20} color="#4E4E4E" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteExpense(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{month} Expenses</Text>
      <FlatList
        data={expenses}
        renderItem={renderExpense}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No expenses added yet.</Text>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddExpense', { month })}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add Expense</Text>
      </TouchableOpacity>
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
    marginBottom: 16,
    color: '#4E4E4E',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 80,
  },
  expenseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4E4E4E',
  },
  expenseAmount: {
    fontSize: 14,
    color: '#4E4E4E',
  },
  expenseCategory: {
    fontSize: 14,
    color: '#5A5AFF',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#5A5AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  addButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#B0B0B0',
  },
});

export default MonthDetailsScreen;
