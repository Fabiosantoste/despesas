import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import MonthDetailsScreen from './src/screens/MonthDetailsScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';  // Adicionando o import

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Controle de Finanças' }} 
        />
        <Stack.Screen 
          name="MonthDetails" 
          component={MonthDetailsScreen} 
          options={{ title: 'Detalhes do Mês' }} 
        />
        <Stack.Screen 
          name="Summary" 
          component={SummaryScreen} 
          options={{ title: 'Resumo do Mês' }} 
        />
        <Stack.Screen 
          name="AddExpense"  // Nome da tela
          component={AddExpenseScreen}  // Componente de adição de despesa
          options={{ title: 'Adicionar Despesa' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

