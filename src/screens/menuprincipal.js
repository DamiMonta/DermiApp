import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Svg, { Path } from 'react-native-svg';

import { UserContext } from '../usuario/UserContext';

const MenuPrincipal = ({ navigation }) => {
    const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));
    const { userData } = useContext(UserContext);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
      


    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setWindowDimensions(window);
        });

        return () => {
            subscription?.remove();
        };
    }, []);

    useEffect(() => {
        if (!userData) {
            navigation.navigate('Login');
        }
    }, [userData, navigation]);

    const { width } = windowDimensions;

    if (!userData) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Svg height={300} width={width}>
                    <Path
                        d={`M0,200 C${width * 0.25},250 ${width * 0.75},100 ${width},200 L${width},0 L0,0 Z`}
                        fill="#7FFFD4"
                    />
                </Svg>
                <View style={styles.headerTextContainer}>
                    <Animatable.Text animation="fadeInLeft" duration={800} style={styles.headerText}>
                        Bienvenido
                    </Animatable.Text>
                    <Animatable.Text animation="fadeInLeft" duration={800} delay={200} style={styles.subHeaderText}>
                        {capitalizeFirstLetter(userData.usuario.nombre)}
                    </Animatable.Text>
                </View>
            </View>

            <View style={styles.menuContainer}>
                <Animatable.View animation="fadeInUp" delay={200} style={styles.menuItem}>
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Historial')}>
                        <AntDesign name="profile" size={80} color="#333" />
                        <Text style={styles.menuText}>Historial</Text>
                    </TouchableOpacity>
                </Animatable.View>
                <Animatable.View animation="fadeInUp" delay={400} style={styles.menuItem}>
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('SeccionFotos')}>
                        <AntDesign name="camera" size={80} color="#333" />
                        <Text style={styles.menuText}>Subir imágenes</Text>
                    </TouchableOpacity>
                </Animatable.View>
                <Animatable.View animation="fadeInUp" delay={600} style={styles.menuItem}>
                    <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('MiPerfil')}>
                        <AntDesign name="user" size={80} color="#333" />
                        <Text style={styles.menuText}>Mi perfil</Text>
                    </TouchableOpacity>
                </Animatable.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    headerTextContainer: {
        position: 'absolute',
        top: 70,
        left: 20,
        right: 20,
        alignItems: 'flex-start',
    },
    headerText: {
        fontFamily: "Raleway_400Regular",
        fontSize: 18,
        color: '#fff',
    },
    subHeaderText: {
        fontFamily: "Raleway_700Bold",
        fontSize: 34,
        color: '#fff',
        marginTop: 5,
    },
    menuContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 150,
    },
    menuItem: {
        width: "85%",
        height: 150,
        backgroundColor: '#fff',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
        marginBottom: 20,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    menuText: {
        fontFamily: "Raleway_400Regular",
        fontSize: 18,
        color: '#333',
        marginTop: 10,
    },
});

export default MenuPrincipal;