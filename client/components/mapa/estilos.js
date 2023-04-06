import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#292929',
      color:'wheat',
    },
    map: {
      width: '100%',
      height: '100%',
      textAlign:'center',
    },
    containermap: {
      width: 400,
      height: 400,
      borderRadius: 20,
      overflow: 'hidden',
    },
    errorContainer:{
      color:'wheat',
      textAlignVertical:'center',
    },
    loadingContainer:{
      color:'wheat',
      textAlign:'center',
    },
    callout: {
      padding: 5,
    },
    title: {
      fontSize: 12,
      textAlign: 'center',
    },
    description: {
      fontSize: 10,
      textAlign: 'center',
    },
    selectortext:{
      color: 'wheat',
    },
    selectorPick:{
      height: 50, 
      width: 150,
      color:'wheat'
    },
    selectorView:{
      maxWidth: '90%', 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center'
    },
    selectorButton:{
      alignItems: 'center'
    },
    selectorColumn:{
      flexDirection: 'column',
      alignItems:'center'
    },
    selectorTextInput:{
      backgroundColor:'#9999',
      borderRadius:10,
      color: 'wheat',
    }
  });
  
  export default styles;