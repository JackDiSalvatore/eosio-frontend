import React, { Component } from 'react';
import { JsonRpc, RpcError } from 'eosjs';

// material-ui dependencies
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

// Components
import AccountDetails from '../AccountDetails';
import TransferTokens from '../TransferTokens';
//import SmartAccount from '../SmartAccount';

// set up styling classes using material-ui "withStyles"
const styles = theme => ({
  appBarStyles: {
    borderRadius: 0,
    boxShadow: '0 0',
  },
  searchBarGridStyles: {
    flexGrow: 1,
    margin: '1% auto 1% auto',
  },
  searchBarStyles: {
    //flexGrow: 1,
    width: '25%',
    //margin: 'auto auto auto auto',
  },
  accountSearchButton: {
    margin: 'auto 0 auto 0',
  },
  formButton: {
    //marginTop: theme.spacing.unit,
    //width: "100%",
  },
  floatingLabelFocusStyle: {
    color: "purple"
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

// Endpoints;
//const localNet = 'http://localhost:888';
//const jungleTestNet = 'https://jungle2.cryptolions.io:443'
const mainNet = 'http://bp.cryptolions.io:8888';
//const mainNetBackup = 'http://api.cypherglass.com:8888';

const endpoint = mainNet;

// NEVER store private keys in any source code in your real life development
// This is for demo purposes only!
const accounts = [
  {"name":"bob",          "privateKey":"5KLqT1UFxVnKRWkjvhFur4sECrPhciuUqsYRihc1p9rxhXQMZBg", "publicKey":"EOS78RuuHNgtmDv9jwAzhxZ9LmC6F295snyQ9eUDQ5YtVHJ1udE6p"},
  {"name":"jdisalvatore",       "privateKey":"5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5", "publicKey":"EOS6kYgMTCh1iqpq9XGNQbEi8Q6k5GujefN9DSs55dcjVyFAq7B6b"},
  {"name":"daniel",       "privateKey":"5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5", "publicKey":"EOS6kYgMTCh1iqpq9XGNQbEi8Q6k5GujefN9DSs55dcjVyFAq7B6b"},  
];


class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      chainInfo: {
        "chain_id": "DISCONNECTED",
      },
      accountInfo: {
        "account_name": "testacc",
        "core_liquid_balance": "25.8044 EOS",
        "head_block_num": 1079,
        "head_block_time": "2018-11-10T00:45:53.500",
        "privileged": false,
        "last_code_update": "1970-01-01T00:00:00.000",
        "created": "2018-11-10T00:37:05.000",
        "ram_quota": -1,
        "net_weight": -1,
        "cpu_weight": -1,
        "net_limit": { "used": -1, "available": -1, "max": -1 },
        "cpu_limit": { "used": -1, "available": -1, "max": -1 },
        "ram_usage": 2724,
        "permissions": [
          { 
            "perm_name": "active",
            "parent": "owner",
            "required_auth": {
              "accounts": [
                {
                  "actor": "",
                  "permission": "",
                  "weight": 0,
                }
              ],
              "keys": [
                {
                  "key": "",
                  "weight": 0,
                }
              ],
              "threshold": 0,
              "waits": [
                {
                  "wait_sec": 0,
                  "weight": 0,
                }
              ]
            }
          } 
        ],
        "total_resources": {
          cpu_weight: "10.5481 EOS",
          net_weight: "10.5482 EOS",
          owner: "jdisalvatore",
          ram_bytes: 14021,
        },
        "self_delegated_bandwidth": {
          cpu_weight: "10.5481 EOS",
          from: "jdisalvatore",
          net_weight: "10.5482 EOS",
          to: "jdisalvatore"
        },
        "refund_request": {
          cpu_amount: "0.0000 EOS",
          net_amount: "880.0000 EOS",
          owner: "jdisalvatore",
          request_time: "2019-05-15T12:25:29"
        },
        "voter_info": {
          flags1: 0,
          is_proxy:0,
          last_vote_weight: "6335582760066.02734375000000000",
          owner: "testacc",
          producers: ["1eostheworld"],
          proxied_vote_weight: "0.00000000000000000",
          proxy: "",
          reserved2: 0,
          reserved3: "0.0000 EOS",
          staked: 9012760
        } 
      },
      eosBalance: [],
      rexBalance: {
        version: 0,
        owner: 'jdisalvatore',
        vote_stake: '880.1797 EOS',
        rex_balance: '8799320.5007 REX',
        matured_rex: 0,
        rex_maturities: [{
            first: '2019-05-06T00:00:00',
            second: '87993205007'
          }
        ]
      }
    };

    this.handleFormEvent = this.handleFormEvent.bind(this);
  }

  async handleFormEvent(event) {
    // stop default behaviour
    event.preventDefault();

    let accountName = event.target.accountNameSearch.value;
    //console.log('Account Name is ' + accountName);

    this.getAccountDetails(accountName);
  }

  async getAccountDetails(accountName) {
    const rpc = new JsonRpc(endpoint, { fetch });
    console.log('Account Name is ' + accountName);
    try {
      rpc.get_info().then(result => this.setState({chainInfo: result}))
      rpc.get_account(accountName).then(result => this.setState({accountInfo: result}));
      rpc.get_currency_balance('eosio.token', accountName, 'EOS').then(result => this.setState({ eosBalance: result}));
      rpc.get_table_rows({
        json: true,
        code: 'eosio',                // contract who owns the table
        scope: 'eosio',               // scope of the table
        table: 'rexbal',              // name of the table as specified by the contract abi
        lower_bound: accountName,
        limit: 1,                     // Here we limit to 1 to get only the
        reverse: false,               // Optional: Get reversed data
        show_payer: false,            // Optional: Show ram payer
      }).then(result => this.setState({ rexBalance: result.rows[0] }));
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.getAccountDetails('eosio');
  }

  render() {
    const { chainInfo, accountInfo, eosBalance, rexBalance } = this.state;
    const { classes } = this.props;

    let accountSearchCard = (
      <form onSubmit={this.handleFormEvent}>

        <Grid container direction="row" justify="center" spacing={8} className={classes.searchBarGridStyles}>
              
              <Grid item className={classes.searchBarStyles}>
                <TextField
                  className={classes.floatingLabelFocusStyle}
                  name="accountNameSearch"
                  autoComplete="off"
                  label="Account Name"
                  placeholder="eosio"
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item className={classes.accountSearchButton}>
                <Button
                  color="primary"
                  className={classes.formButton}
                  type="search">
                  SEARCH
                </Button>
              </Grid>

        </Grid>

      </form>
    )

    return (
      <div>
        <AppBar position="static" color="default" className={classes.appBarStyles}>
          
          <Toolbar>
            <Typography variant="title" color="inherit">
              EOS.IO
            </Typography>
          </Toolbar>

          <Typography style={{fontSize:12}} color="textSecondary">
              Chain ID: {chainInfo.chain_id}
          </Typography>

        </AppBar>

        {accountSearchCard}

        <AccountDetails accountInfo={accountInfo} eosBalance={eosBalance} rexBalance={rexBalance} endpoint={endpoint}></AccountDetails>
        {/* <TransferTokens account={accounts[1]} accountInfo={accountInfo} endpoint={endpoint}></TransferTokens> */}
        {/* <SmartAccount accounts={accounts} endpoint={endpoint}></SmartAccount> */}
      </div>
    );
  }

}

export default withStyles(styles)(Index);
