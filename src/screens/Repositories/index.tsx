import React, { Component } from "react";

import { View, ActivityIndicator, FlatList } from "react-native";
import { List } from "react-native-paper";
import * as Linking from "expo-linking";
import { NavigationProp } from "@react-navigation/native";
import { styles } from "./styles";

type Repository = {
    id: number;
    name: string;
    html_url: string;
    owner: {
        login: string;
    };
};

type RepositoriesProps = {
    children: React.ReactNode;
    navigation: NavigationProp<ReactNavigation.RootParamList>;
    route: {
        params: {
            repositories: Repository[];
        };
    };
};

type RepositoriesState = {
    repositories: Repository[];
    loading: boolean;
};

class Repositories extends Component<RepositoriesProps, RepositoriesState> {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            repositories: [],
        };

        this.onPressRepository = this.onPressRepository.bind(this);
    }

    componentDidMount() {
        if (this.props.route.params.repositories) {
            this.setState({
                repositories: this.props.route.params.repositories,
                loading: false,
            });
        }
    }

    onPressRepository(url: string) {
        return Linking.openURL(url);
    }

    render() {
        const { repositories, loading } = this.state;

        if (loading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator color="red" size="large" />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <FlatList
                    data={repositories}
                    renderItem={({ item }) => (
                        <List.Item
                            key={item.id}
                            title={item.name}
                            description={item.owner.login}
                            onPress={() => this.onPressRepository(item.html_url)}
                        />
                    )}
                />
            </View>
        );
    }
}

export { Repositories };
