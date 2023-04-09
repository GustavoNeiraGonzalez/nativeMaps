import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
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
      color:'wheat',
      backgroundColor:'#292925',
      borderRadius:10,
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
    }, 
    modalView: {
      backgroundColor: '#292929',
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      width: '80%',
      height: '50%',
      position: 'absolute',
      top: '25%',
      left: '10%',
      borderRadius: 10,
    },
    modalText: {
      color: 'wheat',
      fontSize: 18,
      marginBottom: 10,
    },
    modalInput: {
      backgroundColor: '#444',
      color: 'wheat',
      width: '50%',
      padding: 5,
      borderRadius: 5,
      marginBottom: 10,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
  });
  
  export default styles;