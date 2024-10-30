import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ConsultaDetalle = () => {
    const route = useRoute();
    const { registro } = route.params;  // Datos del registro pasados como parámetros

    return (
        <ScrollView style={styles.container}>
            {/* Mostrar la imagen más grande */}
            <Image source={{ uri: registro.imgDesencriptada }} style={styles.imagenGrande} />

            {/* Mostrar detalles de la consulta */}
            <View style={styles.detallesContainer}>
                <Text style={styles.titulo}>Detalles de la Consulta</Text>
                <Text style={styles.texto}>Fecha: {registro.dia}/{registro.mes}/{registro.ano}</Text>
                <Text style={styles.texto}>Enfermedad: {registro.resultadosEnfermedades[0].enfermedad}</Text>
                <Text style={styles.texto}>Resultado: {(registro.resultadosEnfermedades[0].resultado * 100).toFixed(2)}%</Text>
                
                {/* Puedes agregar otros detalles como comentarios del paciente y del médico */}
                <Text style={styles.texto}>Comentarios del Paciente: {registro.comentariosPaciente}</Text>
                <Text style={styles.texto}>Comentarios del Médico: {registro.comentariosMedico}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#E8F0F2',
    },
    imagenGrande: {
      width: '90%',
      alignSelf: 'center',
      justifyContent: "center",
      height: 550,
      borderRadius: 15,
      marginBottom: 20,
      marginTop: "10%",
      resizeMode: 'cover',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    detallesContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 20,
      padding: 20,
      marginHorizontal: 15,
      marginBottom: 30,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 4,
    },
    titulo: {
      fontFamily: 'DMSans_700Bold',
      fontSize: 26,
      color: '#34495E',
      marginBottom: 15,
      textAlign: 'center',
    },
    texto: {
      fontFamily: 'DMSans_400Regular',
      fontSize: 18,
      color: '#555',
      lineHeight: 24,
      marginBottom: 10,
    },
    label: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#34495E',
      marginBottom: 5,
    },
    comentarioContainer: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: '#F7F9F9',
      borderRadius: 10,
    },
    comentarioTexto: {
      fontFamily: 'DMSans_400Regular',
      fontSize: 16,
      color: '#777',
      lineHeight: 22,
    },
  });

export default ConsultaDetalle;
