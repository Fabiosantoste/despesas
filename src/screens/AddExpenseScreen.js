import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const AddExpenseScreen = ({ route, navigation }) => {
  const { month, expense } = route.params;
  const [name, setName] = useState(expense?.name || '');
  const [amount, setAmount] = useState(expense?.amount || '');
  const [category, setCategory] = useState(expense?.category || '');

  // Definindo as categorias e seus ícones
  const categories = [
    { id: 'food', name: 'Alimentação', icon: 'fast-food' },
    { id: 'transport', name: 'Transporte', icon: 'car' },
    { id: 'entertainment', name: 'Entretenimento', icon: 'film' },
    { id: 'utilities', name: 'Utilidades', icon: 'bulb' },
    { id: 'shopping', name: 'Compras', icon: 'cart' },
    { id: 'health', name: 'Saúde', icon: 'medkit' },
  ];

  // Função para salvar ou atualizar a despesa no AsyncStorage
  const handleSave = async () => {
    if (!name || !amount || !category) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const newExpense = {
      id: expense?.id || Date.now().toString(),
      name,
      amount: parseFloat(amount),
      category,
    };

    try {
      // Recupera as despesas do mês
      const storedExpenses = await AsyncStorage.getItem(`@expenses_${month}`);
      const expenses = storedExpenses ? JSON.parse(storedExpenses) : [];

      console.log('Despesas carregadas do AsyncStorage:', expenses);

      // Se for uma atualização, substitui a despesa existente
      if (expense) {
        const updatedExpenses = expenses.map((item) =>
          item.id === expense.id ? newExpense : item
        );
        console.log('Despesas após a atualização:', updatedExpenses);

        await AsyncStorage.setItem(`@expenses_${month}`, JSON.stringify(updatedExpenses));
      } else {
        // Se for uma nova despesa, adiciona à lista
        expenses.push(newExpense);
        console.log('Despesas após adicionar nova:', expenses);

        await AsyncStorage.setItem(`@expenses_${month}`, JSON.stringify(expenses));
      }

      // Verificar se o armazenamento foi atualizado corretamente
      const updatedStoredExpenses = await AsyncStorage.getItem(`@expenses_${month}`);
      console.log('Despesas após o setItem:', updatedStoredExpenses);

      // Volta para a tela anterior após salvar
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar a despesa', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar a despesa.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Adicionar Despesa</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor"
        value={amount.toString()}
        keyboardType="numeric"
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryButton, category === cat.id && styles.selectedCategory]}
            onPress={() => setCategory(cat.id)}
          >
            <Ionicons name={cat.icon} size={24} color={category === cat.id ? '#fff' : '#4E4E4E'} />
            <Text style={[styles.categoryText, category === cat.id && styles.selectedCategoryText]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4E4E4E',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    borderColor: '#D0D0D0',
    borderWidth: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
    color: '#4E4E4E',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryButton: {
    alignItems: 'center',
    margin: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    width: 90,
    height: 120,
    justifyContent: 'center',
  },
  selectedCategory: {
    backgroundColor: '#5A5AFF',
  },
  categoryText: {
    marginTop: 8,
    color: '#4E4E4E',
    fontSize: 12,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#5A5AFF',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddExpenseScreen;
