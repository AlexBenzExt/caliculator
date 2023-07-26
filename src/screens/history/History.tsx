import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Iprops{
    navigation?:any
}

export default class History extends Component <Iprops>{
  state = {
    historyData: [],
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const response: any = await AsyncStorage.getItem('caliculator');
    const data = await JSON.parse(response);
    console.log(data);
    this.setState({historyData: data});
  };

  backHandler=()=>{
    this.props.navigation.navigate("Caliculator")
  }

  clearHandler=async()=>{
  await AsyncStorage.clear();
  this.setState({historyData:[]})
  }

  renderItem = (item:any) => {
    console.log(item);
    return (
      <View style={styles.container}>
        <Text style={styles.condition}>{item.item.screenTxt}</Text>
        <Text style={styles.condition}>--</Text>
        <Text style={styles.condition}>{item.item.total}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.main}>
        <TouchableOpacity style={styles.button} onPress={this.backHandler}>
            <Text style={styles.buttonTxt}>Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.clearHandler}>
            <Text style={styles.buttonTxt}>Clear History</Text>
        </TouchableOpacity>
        <FlatList
          data={this.state.historyData}
          keyExtractor={(item:any) => item.id}
          renderItem={item => this.renderItem(item)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
    backgroundColor: '#374353',
  },
  condition: {
    fontSize: 20,
    color: 'white',
  },
  container: {
    backgroundColor: '#374353',
    width:"80%",
    alignItems:"center",
    justifyContent:"space-evenly",
    alignSelf:"center",
    borderRadius:25,
    flexDirection:"row",
    gap:30,
    marginTop:30,
    elevation:20,
    marginBottom:30,
    shadowColor:"hsla(122, 3%, 56%, 0.98)",
    padding:20
  },
  button: {
    backgroundColor: '#374353',
    width: '80%',
    height: 50,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: 'hsla(122, 3%, 56%, 0.98)',
    shadowOffset: {
      width: 100,
      height: 100,
    },
    elevation: 7,
    marginBottom: 14,
  },
  buttonTxt: {
    color: 'white',
    fontSize: 25,
  },
});
