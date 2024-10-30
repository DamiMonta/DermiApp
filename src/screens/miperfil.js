import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../usuario/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MiPerfil = () => {
    const { userData, setUserData } = useContext(UserContext);
    const navigation = useNavigation();


    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Función para cerrar sesión
    const cerrarSesion = async () => {
        try {
            // Confirmación para cerrar sesión
            Alert.alert(
                "Cerrar Sesión",
                "¿Estás seguro que deseas cerrar sesión?",
                [
                    { text: "Cancelar", style: "cancel" },
                    {
                        text: "Sí",
                        onPress: async () => {
                            // Eliminar datos de sesión (token u otra información de usuario) de AsyncStorage
                            await AsyncStorage.removeItem('token');
                            await AsyncStorage.removeItem('userData');

                            // Limpiar el contexto de usuario
                            setUserData(null);

                            // Redirigir al usuario a la pantalla de inicio de sesión después de cerrar sesión
                            navigation.navigate('Login');
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Función para volver a la actividad anterior
    const volver = () => {
        navigation.goBack();
    };

    // Verificar si userData está disponible
    if (!userData || !userData.usuario) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Botón para volver */}
            <TouchableOpacity style={styles.backButton} onPress={volver}>
                <Ionicons name="arrow-back-outline" size={24} color="#00796B" />
            </TouchableOpacity>

            {/* Foto y nombre en un contenedor con fondo */}
            <View style={styles.profileHeader}>
                <View style={styles.imageContainer}>
                    <Image 
                        source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder, reemplázala por la URL del usuario
                        style={styles.profileImage}
                    />
                    <Text style={styles.userName}>{capitalizeFirstLetter(userData.usuario.nombre)} {capitalizeFirstLetter(userData.usuario.apellido)}</Text>
                </View>
            </View>

            {/* Información detallada del usuario en otro contenedor que ocupa todo el height */}
            <View style={styles.userInfoContainer}>
                <Text style={styles.userEmail}>{userData.usuario.email}</Text>
                <Text style={styles.userRole}>Rol: {userData.usuario.rol}</Text>
                <Text style={styles.userConsultas}>Consultas realizadas: {userData.usuario.consultas}</Text>

                {/* Botón para cerrar sesión dentro del contenedor de información */}
                <TouchableOpacity 
                    style={styles.button}
                    onPress={cerrarSesion} // Llamada a la función de cerrar sesión
                >
                    <Ionicons name="log-out-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0f7fa', // Color de fondo de toda la pantalla
    },
    backButton: {
        position: 'absolute',
        top: "5%",
        left: 20,
        zIndex: 1,
        backgroundColor: 'transparent',
        padding: 5,
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: "10%",
    },
    imageContainer: {
        marginTop: 20,
        alignItems: 'center',

        padding: 15,
        borderRadius: 10,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    userName: {
        fontSize: 30,
        fontFamily: "Raleway_400Regular",
        color: '#00796B',
    },
    userInfoContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 20,
    },
    userEmail: {
        fontSize: 16,
        color: '#00796B',
        marginBottom: 5,
    },
    userRole: {
        fontFamily: "DMSans_400Regular",
        fontSize: 16,
        color: '#00796B',
        marginBottom: 5,
    },
    userConsultas: {
        fontFamily: "DMSans_400Regular",
        fontSize: 16,
        color: '#00796B',
        marginBottom: 20, // Añadido para separar el botón
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 10,
        width: '100%', // Ocupa el 100% del contenedor
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: "DMSans_400Regular",
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
    loadingText: {
        fontSize: 18,
        color: '#555',
    },
});

export default MiPerfil;
