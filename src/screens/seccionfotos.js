import React, { useState, useContext, useEffect } from 'react';
import { View, Button, Image, ScrollView, StyleSheet, TouchableOpacity, Text, Alert, Modal, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons'; 
import * as FileSystem from 'expo-file-system'; // Para convertir a base64
import axios from 'axios';
import Svg, { Path } from 'react-native-svg'; // Importar Svg y Path
import * as ImageManipulator from 'expo-image-manipulator';

import { UserContext } from '../usuario/UserContext'; // Importar el contexto

const SeccionFotos = () => {


    const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window')); // Estado para almacenar dimensiones
    const { width } = windowDimensions; // Obtener el ancho de la pantalla
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB en bytes


    //const url = import.meta.env.VITE_APP_IP
    //const key = import.meta.env.VITE_APP_SECRETORPRIVATEKEY
    //const id = "64cd27429260c6794d2320bd"


    const { userData } = useContext(UserContext); // Acceder a los datos del usuario

    const [photos, setPhotos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [encriptcion, setEncriptcion] = useState('')

    const takePhoto = async () => {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permisos necesarios', 'Es necesario otorgar permisos para usar la cámara.');
        return;
      }
  
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
  
      if (!result.canceled) {
        const photoUri = result.assets[0].uri;
        setPhotos(prevPhotos => [...prevPhotos, photoUri]);
      } else {
        Alert.alert('Foto cancelada', 'No se tomó ninguna foto.');
      }
    };
  
    const openModal = (uri) => {
      setSelectedPhoto(uri);
      setModalVisible(true);
    };
  
    const closeModal = () => {
      setModalVisible(false);
      setSelectedPhoto(null);
    };
  
    const deletePhoto = (uri) => {
      setPhotos(prevPhotos => prevPhotos.filter(photo => photo !== uri));
    };


    const handleSendImages = () => {
      // Usa photos que es tu variable de imágenes
      if (photos && Array.isArray(photos) && photos.length > 0) {
          convertImagesToBase64(photos);
      } else {
          console.log("No hay imágenes para convertir.");
      }
    };


    const resizeImageIfNeeded = async (uri) => {
      try {
        const imageInfo = await FileSystem.getInfoAsync(uri);
        if (imageInfo.size > MAX_FILE_SIZE) {
          // Resize la imagen para que su tamaño sea menor o igual a 1MB
          const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 800 } }], // Ajusta el ancho según sea necesario
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
          );
          return manipResult.uri; // devuelve la nueva URI de la imagen redimensionada
        }
        return uri; // Si la imagen ya es menor o igual a 1MB, devuelve la URI original
      } catch (error) {
        console.error("Error al redimensionar la imagen:", error);
        throw error;
      }
    };


    // Función que convierte imágenes a base64 y las imprime
    const convertImagesToBase64 = async (images) => {
      try {
        const base64Images = await Promise.all(
          images.map(async (uri, index) => {

            const resizedUri = await resizeImageIfNeeded(uri);

            const base64 = await FileSystem.readAsStringAsync(resizedUri, { encoding: FileSystem.EncodingType.Base64 });
            console.log(`Imagen ${index + 1} en Base64: ${base64.substring(0, 100)}...`);
            const cleanedData = base64.replace(/^data:image\/[a-z]+;base64,/, '');

            //return base64;
            setEncriptcion(cleanedData);
            sendImagesToBackend(cleanedData);
          })
        );
        //return base64Images;
      } catch (error) {
        console.error("Error al convertir las imágenes a base64:", error);
      }
    };


    const sendImagesToBackend = async (base64Image) => {

      //console.log(base64Image)

      const formData = new FormData();
      formData.append('id', userData.usuario.uid);
      formData.append('encriptcion', base64Image);

      // usar my IP cuando hago pruebas en expo go
      const url = "http://192.168.1.143:8080";

      //console.log("IMAGEN: ",base64Image)
      console.log(base64Image.length);

      try {

        const response = await axios.put(`${url}/api/uploads/files/2/`, formData, {
          headers: {
              "Content-Type": "multipart/form-data",
          },
        });
        console.log(response)
        console.log('Respuesta del servidor:', response.data);


        

      } catch (error) {
        //console.log(error.response.data)
        if (axios.isAxiosError(error)) {
            console.error('Error de Axios:', error.message);
            if (error.response) {
                console.error('Detalles de la respuesta:', error.response.data);
            } else {
                console.error('Detalles del error:', error);
            }
        } else {
            console.error('Error desconocido:', error);
        }
    }

    useEffect(() => {
      const subscription = Dimensions.addEventListener('change', ({ window }) => {
        setWindowDimensions(window); // Actualizar las dimensiones en el estado
      });
  
      return () => {
        subscription?.remove(); // Limpiar el listener al desmontar el componente
      };
    }, []);


  };

  
    return (
      <View style={styles.container}>

        
        <View style={styles.headerContainer}>
        <Svg height={300} width={width}>
          <Path
            d={`M0,200 C${width * 0.25},250 ${width * 0.75},100 ${width},200 L${width},0 L0,0 Z`} 
            fill="#7FFFD4" 
          />
        </Svg>
        </View>


        <View style={styles.scrollViewContainer}>
          
          <ScrollView contentContainerStyle={styles.photoContainer}>
            {photos.length > 0 ? (
              photos.map((uri, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <TouchableOpacity onPress={() => openModal(uri)}>
                    <Image source={{ uri }} style={styles.photo} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => deletePhoto(uri)}>
                    <AntDesign name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={{fontFamily: 'DMSans_400Regular',}}>No hay fotos tomadas.</Text>
            )}
          </ScrollView>
        </View>
  
        {selectedPhoto && (
          <Modal visible={modalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <Image source={{ uri: selectedPhoto }} style={styles.modalImage} resizeMode="contain" />
            </View>
          </Modal>
        )}

        <View style={styles.buttonContainer}>
          
          <TouchableOpacity style={styles.buttonSeccionFotos} onPress={takePhoto} >
            <Text style={styles.buttonText}>Tomar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSeccionFotos} onPress={handleSendImages}>
            <Text style={styles.buttonText}>Enviar Imagenes</Text>
          </TouchableOpacity>
        </View>



      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    scrollViewContainer: {
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 10,
      overflow: 'hidden', 
      marginTop: 50,
      width: '100%', 
      maxHeight: 340,
    },
    photoContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: 10,
      backgroundColor: "#e8e8e8"
    },
    headerContainer: {
      position: 'absolute', // Hace que el header se superponga
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1, // Asegura que el header esté por encima
    },
    photoWrapper: {
      position: 'relative',
      margin: 5,
    },
    photo: {
      width: 150,
      height: 150,
      borderRadius: 8,
    },
    deleteButton: {
      position: 'absolute',
      top: 5,
      right: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 20,
      padding: 5,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: 20,
      padding: 10,
      zIndex: 1,
    },
    closeButtonText: {
      fontSize: 16,
      color: 'black',
    },
    modalImage: {
      width: '100%',
      height: '80%',
    },
    buttonContainer: {
      flexDirection: 'row', // Alinear en horizontal
      justifyContent: 'space-between', // Espacio entre botones
      marginVertical: 20, // Espaciado vertical
    },
    buttonSeccionFotos: {
      width: "40%",
      borderRadius: 50,
      color: "#7FFFD4",
      height: 50,
      backgroundColor: '#40E0D0', // Color de fondo del botón
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
    },
    buttonText: {
      fontFamily: 'DMSans_700Bold',
      color: 'white',
      fontSize: 15,
    }

  });


export default SeccionFotos;
