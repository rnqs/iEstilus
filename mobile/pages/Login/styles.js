import {StyleSheet, Dimensions} from 'react-native';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center'
  },
  inputContainer: {
      marginBottom: 25
  },
  input: {
      width: Dimensions.get('window').width - 150,
      borderRadius: 20,
      fontSize: 16,
      backgroundColor: '#99999920',
      paddingHorizontal: 20,
      paddingVertical: 10
  },
  button: {
      backgroundColor: '#f98f42',
      alignItems: 'center',
      justifyContent: 'center',
      height: 45,
      borderRadius: 20,
      width: Dimensions.get('window').width - 150,
      marginTop: 20
  }
});

export default styles;