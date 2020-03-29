import * as React from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    TouchableOpacity
} from 'react-native';
import {
  TextInputMask
} from 'react-native-masked-text';
import styles from './styles';

function Login() {
  const [phone, setPhone] = React.useState();
  const [name, setName] = React.useState();
  const [cpf, setCpf] = React.useState();

  return (
    <View style={styles.container}>
        <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          value={
            name
          }
          onChangeText={
            text => {
              setName(text)
            }
          }
          style={styles.input}
          />
        </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Telefone</Text>
        <TextInputMask
          type={
            'cel-phone'
          }
          options={
            {
              maskType: 'BRL',
              withDDD: true,
              dddMask: '(99) '
            }
          }
          value={
            phone
          }
          onChangeText={
            text => {
              setPhone(text)
            }
          }
          style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
        <Text style={styles.label}>CPF</Text>
        <TextInputMask
          type={
            'cpf'
          }
          value={
            cpf
          }
          onChangeText={
            text => {
              setCpf(text)
            }
          }
          style={styles.input}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => {
          Alert.alert('Informacões do usuario:', `\n\nNome: ${name}\n\nTelefone: ${phone}\n\nCPF: ${cpf}`)
        }}>
          <Text>Enviar</Text>
        </TouchableOpacity>
      </View>
  );
}

export default Login;