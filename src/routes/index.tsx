import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, StackNavigationOptions } from "@react-navigation/stack";

// telas
import { Home } from "../screens/Home";
import { Repositories } from "../screens/Repositories";
import { Perfil } from "../screens/Perfil";

const Stack = createStackNavigator();

const AppStackRoutes: React.FC = () => (
    <Stack.Navigator screenOptions={defaultHeaderScreenOptions}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Repositories" component={Repositories} options={{ title: "Repositórios" }} />
    </Stack.Navigator>
);

const Routes: React.FC = () => {
    return (
        <NavigationContainer>
            <AppStackRoutes />
        </NavigationContainer>
    );
};

const defaultHeaderScreenOptions: StackNavigationOptions = {
    headerTitleAlign: "center",
};

export { Routes };
