import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const arr = [
  {id: 'c', text: 'C'},
  {id: 'h', text: 'H'},
  {id: '%', text: '%'},
  {id: '/', text: '/'},
  {id: 7, text: 7},
  {id: 8, text: 8},
  {id: 9, text: 9},
  {id: '*', text: '*'},
  {id: 4, text: 4},
  {id: 5, text: 5},
  {id: 6, text: 6},
  {id: '-', text: '-'},
  {id: 1, text: 1},
  {id: 2, text: 2},
  {id: 3, text: 3},
  {id: '+', text: '+'},
  {id: 0, text: 0},
  {id: 11, text: '.'},
  {id: 'd', text: 'D'},
  {id: '=', text: '='},
];

interface Iprops {
  navigation?: any;
}

interface Istate {
  firstNumber: string;
  secondNumber: string;
  thirdNumber: string;
  screenTxt: string;
  total: string;
  totalFont: boolean;
  lastChar: number;
  symbol: string;
  occurance: boolean;
  dot: boolean;
  historyData23: any;
  toggleShow: boolean;
}

export default class Caliculator extends Component<Iprops, Istate> {
  constructor(props: Iprops) {
    super(props);
    this.state = {
      firstNumber: '',
      secondNumber: '',
      thirdNumber: '',
      screenTxt: '',
      total: '',
      totalFont: false,
      lastChar: 0,
      symbol: '',
      occurance: false,
      dot: false,
      historyData23: [],
      toggleShow: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const response: any = await AsyncStorage.getItem('caliculator');
    const data = response ? await JSON.parse(response) : [];
    this.setState({historyData23: data});
  };

  updateHistory = async () => {
    const {total, screenTxt} = this.state;
    const id = Date.now();
    const value = {id, screenTxt, total};
    this.setState(prevState => ({
      historyData23: [...prevState.historyData23, value],
    }));
  };

  sendData = async () => {
    setTimeout(async () => {
      const {historyData23} = this.state;
      await AsyncStorage.setItem('caliculator', JSON.stringify(historyData23));
    }, 1000);
  };

  caliculateHadler = async (item: any) => {
    const {
      screenTxt,
      lastChar,
      firstNumber,
      secondNumber,
      symbol,
      thirdNumber,
      occurance,
      historyData23,
    } = this.state;

    if (item.item.id == 11) {
      this.setState({dot: true});
    }

    if (item.item.id == 'd') {
      const value = screenTxt.slice(0, -1);
      this.setState({screenTxt: value, occurance: false});
      return;
    }
    if (item.item.id == '=') {
      this.setState(
        {total: eval(screenTxt), totalFont: true},
        this.updateHistory,
      );
      const tot = eval(screenTxt);
      const id = Date.now();
      const value = {id, screenTxt, tot};
      await AsyncStorage.setItem('caliculator', JSON.stringify(historyData23));
      return;
    } else {
      this.setState({totalFont: false, total: ''});
    }

    if (item.item.id == 'h') {
      this.setState({screenTxt: ''});
      this.props.navigation.push('Histroy');
      return;
    }
    const char = screenTxt.slice(-1);

    if (!isNaN(item.item.id)) {
      this.setState(prevState => ({
        firstNumber: prevState.firstNumber + item.item.text,
        occurance: false,
      }));
    } else {
      if (item.item.id == 'c') {
        this.setState({screenTxt: ''});
        return;
      }

      this.setState({occurance: true, dot: false});
      if (occurance) {
        return;
      }

      if (lastChar == 0) {
        this.setState({
          secondNumber: this.state.firstNumber,
          firstNumber: '',
          lastChar: 1,
          symbol: item.item.id,
          dot: false,
        });
      }

      if (lastChar == 1) {
        const value = `${firstNumber}${symbol}${secondNumber}`;
        const evalue = eval(value);
        console.log(evalue, lastChar);
        this.setState({
          thirdNumber: evalue,
          symbol: item.item.id,
          lastChar: 2,
          firstNumber: '',
        });
        console.log('eval', eval(value), lastChar);
      }
      if (lastChar == 2) {
        const value = `${thirdNumber}${symbol}${firstNumber}`;
        const evalue = eval(value);
        this.setState({
          thirdNumber: evalue,
          symbol: item.item.id,
          lastChar: 2,
          firstNumber: '',
        });
      }
    }

    this.setState(prevState => ({
      screenTxt: prevState.screenTxt + item.item.text,
    }));
  };

  renderItem = (item: any) => {
    const {dot} = this.state;

    return (
      <View style={styles.flat}>
        <TouchableOpacity
          disabled={item.item.id == 11 && dot ? true : false}
          style={styles.button}
          onPress={() => this.caliculateHadler(item)}>
          <Text style={styles.buttonTxt}>{item.item.text}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    this.sendData();
    const {
      totalFont,
      lastChar,
      firstNumber,
      secondNumber,
      occurance,
      historyData23,
    } = this.state;
    console.log(historyData23);
    return (
      <View style={styles.main}>
        <View style={styles.screen}>
          <Text style={[styles.conditions, totalFont && {fontSize: 20}]}>
            {this.state.screenTxt}
          </Text>
          <Text style={[styles.conditions]}>{this.state.total}</Text>
        </View>
        <View style={styles.flatlist}>
          <FlatList
            data={arr}
            numColumns={4}
            keyExtractor={(item: string | number | any) => item.id}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
    backgroundColor: '#374353',
  },
  screen: {
    marginTop: 20,
    width: '95%',
    height: 250,
    alignSelf: 'center',
    borderRadius: 20,
    justifyContent: 'center',
  },
  screenTxt: {
    color: 'white',
    marginLeft: 20,
  },
  conditions: {
    fontSize: 40,
    color: 'white',
    alignSelf: 'flex-end',
  },
  flat: {
    flex: 1,
  },
  flatlist: {
    padding: 5,
    height: 700,
  },
  buttonsContainer: {},
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
