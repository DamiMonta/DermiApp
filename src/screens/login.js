import React, { useEffect, useState, useContext } from 'react';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import logo from "./../../assets/images/logoLogin.png";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image 
} from 'react-native';
import axios from 'axios';
import { UserContext } from '../usuario/UserContext'; // Importar el contexto

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window')); // Estado para almacenar dimensiones

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowDimensions(window); // Actualizar las dimensiones en el estado
    });

    return () => {
      subscription?.remove(); // Limpiar el listener al desmontar el componente
    };
  }, []);

  const { width } = windowDimensions; // Obtener el ancho de la pantalla
  const { setUserData } = useContext(UserContext); // Usar el contexto

  // Función para conectarse con el backend e iniciar sesión
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(email)) {
      Alert.alert('Error', 'El formato del email es incorrecto');
      return;
    }

    try {
      // Llamada a tu API backend
      const response = await axios.post('http://192.168.1.143:8080/api/auth/login', {
        correo: email,
        password: password
      });

      // Verifica la respuesta de tu servidor
      if (response.status === 200) {
        Alert.alert('Login exitoso', 'Has iniciado sesión correctamente');
        console.log('Datos del usuario:', response.data);

        // Guardar los datos en el contexto
        const userData = response.data;
        setUserData(userData);


        console.log("USUARIO: ", userData);

        // Navegar a SeccionFotos
        navigation.navigate('menuprincipal');

        // Limpiar los campos de email y contraseña
        setEmail('');
        setPassword('');

      } else {
        Alert.alert('Error', 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al iniciar sesión. Intenta nuevamente.');
    }
  };



  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="height"
      //keyboardVerticalOffset={100} // Ajusta este valor según sea necesario
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <View style={styles.headerContainer}>
          {/* Capa de fondo más larga */}
          <Svg height={400} width={width} style={{ position: 'absolute', zIndex: -1 }}>
            <Defs>
              <LinearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#32CD32" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#7FFFD4" stopOpacity="0.8" />
              </LinearGradient>
            </Defs>
            <Path
              d={`M0,300 C${width * 0.5},350 ${width * 0.5},200 ${width},300 L${width},0 L0,0 Z`}
              fill="url(#grad2)"
            />
          </Svg>

          {/* Capa superior */}
          <Svg height={300} width={width}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#40E0D0" stopOpacity="1" />
                <Stop offset="100%" stopColor="#7FFFD4" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <View style={styles.logoContainer}>
              <Image source={logo} style={styles.logo} />
            </View>
            <Path
              d={`M0,300 C${width * 0.5},300 ${width * 0.5},150 ${width},300 L${width},0 L0,0 Z`}
              fill="url(#grad)"
            />
          </Svg>
          
          
          
          <Text style={{color: "#40E0D0", marginTop: 45, fontSize: 30, fontFamily: "Raleway_700Bold"}}>Iniciar Sesión</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Acceder</Text>
        </TouchableOpacity>



        
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  inner: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  headerContainer: {
    position: 'absolute',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },

  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: "15%",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },

  centeredText: {
    position: 'absolute',
    color: '#fff',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: "30%",
  },

  
  inputContainer: {
    marginBottom: 20,
    paddingTop: "100%",

  },

  input: {
    fontFamily: 'Raleway_400Regular',
    height: 60,
    marginBottom: 15,
    paddingLeft: 15,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',

    borderWidth: 0,
    fontSize: 18,
  },

  button: {
    height: 50,
    backgroundColor: '#40E0D0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    fontFamily: 'Raleway_400Regular',
    color: 'white',
    fontSize: 18,
  },

});

export default Login;