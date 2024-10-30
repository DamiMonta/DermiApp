import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker'; // Importar el DateTimePicker
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { UserContext } from '../usuario/UserContext';

const Historial = () => {
    const { userData } = useContext(UserContext);
    const navigation = useNavigation();
    const [busqueda, setBusqueda] = useState('');
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);

    const API_URL = `http://192.168.1.143:8080/api/buscar/consulta/${userData.usuario.uid}`;

    const obtenerRegistros = async () => {
        try {
            const response = await axios.get(API_URL);
            setRegistros(response.data.results);
            setLoading(false);
        } catch (err) {
            console.error('Error al obtener los registros:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerRegistros();
    }, []);

    const desencriptarImagen = (imagenEncriptada) => {
        const claveSecreta = 'Est0EsMyPubl1cKey23@913';
        const bytes = CryptoJS.AES.decrypt(imagenEncriptada, claveSecreta);
        const imagenDesencriptada = bytes.toString(CryptoJS.enc.Utf8);
        return imagenDesencriptada;
    };

    // Filtrar registros según la búsqueda y la fecha seleccionada
    const registrosFiltrados = registros.filter((registro) => {
        const fechaRegistro = `${registro.dia}/${registro.mes}/${registro.ano}`;
        const fechaSeleccionada = selectedDate ? selectedDate.toLocaleDateString() : '';
        const cumpleBusqueda = registro._id?.toString().toLowerCase().includes(busqueda.toLowerCase());
        const cumpleFecha = !selectedDate || fechaRegistro === fechaSeleccionada;
        return cumpleBusqueda && cumpleFecha;
    });

    const renderItem = ({ item }) => {
        const imagenDesencriptada = desencriptarImagen(item.img);
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('ConsultaDetalle', { registro: { ...item, imgDesencriptada: imagenDesencriptada } })}
            >
                <Image source={{ uri: imagenDesencriptada }} style={styles.imagenRegistro} />
                <Text style={styles.fechaRegistro}>Fecha: {item.dia}/{item.mes}/{item.ano}</Text>
                {item.resultadosEnfermedades.map((resultado, index) => (
                    <View key={index} style={styles.resultadoContainer}>
                        <Text style={styles.enfermedad}>Enfermedad: {resultado.enfermedad}</Text>
                        {resultado.enfermedad !== "no ser ninguna enfermedad" && (
                            <Text style={styles.resultado}>Resultado: {(resultado.resultado * 100).toFixed(2)}%</Text>
                        )}
                    </View>
                ))}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botonVolver}>
                    <Ionicons name="arrow-back" size={30} color="#fff" />
                </TouchableOpacity>
                
                
                <TouchableOpacity onPress={() => setShowCalendar(true)} style={styles.calendarButton}>
                    <Ionicons name="calendar" size={25} color="#fff" />
                </TouchableOpacity>

                {showCalendar && (
                    <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setShowCalendar(false);
                            if (event.type === "set" && date) {
                                setSelectedDate(date);
                            }
                        }}
                    />
                )}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.error}>Error: {error}</Text>
            ) : (
                <FlatList
                    data={registrosFiltrados}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    contentContainerStyle={styles.flatListContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#7FFFD4',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Espacio entre elementos
        marginTop: 30,
    },
    botonVolver: {
        marginRight: 10,
    },

    calendarButton: {
        marginLeft: 10,

    },
    flatListContent: {
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    card: {
        flex: 1,
        margin: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    imagenRegistro: {
        width: '100%',
        height: 100,
        marginBottom: 10,
        borderRadius: 5,
    },
    fechaRegistro: {
        fontFamily: 'DMSans_700Bold',
        fontSize: 14,
        marginBottom: 5,
    },
    resultadoContainer: {
        marginBottom: 5,
    },
    enfermedad: {
        fontFamily: 'DMSans_400Regular',
        fontSize: 14,
        color: '#333',
    },
    resultado: {
        fontFamily: 'DMSans_400Regular',
        fontSize: 12,
        color: '#555',
    },
    error: {
        textAlign: 'center',
        color: 'red',
        fontSize: 16,
    },
});

export default Historial;
