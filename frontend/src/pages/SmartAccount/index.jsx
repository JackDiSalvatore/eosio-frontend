import React, { Component } from 'react';
import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';           // development only

// material-ui dependencies
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

// set up styling classes using material-ui "withStyles"
const styles = theme => ({
  card: {
    margin: 20,
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  formButton: {
    marginTop: theme.spacing.unit,
    width: "100%",
  },
  pre: {
    background: "#ccc",
    padding: 10,
    marginBottom: 0,
  },
});

// SmartAccount component
class SmartAccount extends Component {

  constructor(props) {
    super(props)
    this.state = {
      accountInfo: {
        "account_name": "testacc",
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
        "total_resources": null,
        "self_delegated_bandwidth": null,
        "refund_request": null,
        "voter_info": null 
      } // to store the table rows from smart contract
    };
    this.handleFormEvent = this.handleFormEvent.bind(this);
  }

  // generic function to handle form events (e.g. "submit" / "reset")
  // push transactions to the blockchain by using eosjs
  async handleFormEvent(event) {
    // stop default behaviour
    event.preventDefault();

    // collect form data
    let account = event.target.account.value;
    let privateKey = event.target.privateKey.value;
    let publicKey = event.target.pubKey.value;

    // prepare variables for the switch below to send transactions
    let actionName = "";
    let actionData = {};

    // '{
    //  "proposer": "daniel",
    //  "proposal_name": "test1",
    //  "requested": [
    //     {
    //       "actor": "chestnutmsig",
    //       "permission": "security"
    //     }, 
    //     {
    //       "actor": "daniel",
    //       "permission": "chestnut"
    //     }
    //   ],
    //   "trx": {
    //     "expiration": "2020-04-22T16:39:15",
    //     "ref_block_num": 0,
    //     "ref_block_prefix": 0,
    //     "max_net_usage_words": 0,
    //     "max_cpu_usage_ms": 0,
    //     "delay_sec": 0,
    //     "context_free_actions":[],
    //     "actions": [
    //       { 
    //         "account": "eosio.token",
    //         "name": "transfer",
    //         "authorization": [
    //           {
    //             "actor": "daniel",
    //             "permission": "active"
    //           }
    //         ],
    //         "data": "0000000044e5a64900000000001fa3c120a107000000000004454f53000000000d74657374206d756c7469736967"
    //       }
    //     ],
    //     "transaction_extensions": []
    //   } 
    // }'

    // define actionName and action according to event type
    switch (event.type) {
      case 'submit':
        actionName = 'propose';
        // actionData = {
        //   proposer: account,
        //   proposal_name: 'goback',
        //   requested: [
        //     {
        //       'actor': 'chestnutmsig',
        //       'permission': 'security'
        //     },
        //     {
        //       'actor': account,
        //       'permission': 'chestnut'
        //     }
        //   ],
        //   trx: {
        //     expiration: '2020-04-22T16:39:15',
        //     ref_block_num: 0,
        //     ref_block_prefix: 0,
        //     max_net_usage_words: 0,
        //     max_cpu_usage_ms: 0,
        //     delay_sec: 0,
        //     context_free_actions: [],
        //     actions: [
        //       {
        //         account: 'eosio',
        //         name: 'updateauth',
        //         authorization: [
        //           {
        //             actor: account,
        //             permission: 'chestnut'
        //           }
        //         ],
        //         data: {
        //           account: account,
        //           permission: 'owner',
        //           parent: '',
        //           auth: {
        //             keys: [
        //               {
        //                 key: publicKey,
        //                 weight: 1
        //               }
        //             ],
        //             threshold: 1,
        //             accounts: [],
        //             waits: []
        //           }
        //         }
        //       }
        //     ],
        //     transaction_extensions: []
        //   }
        // };
        break;
      default:
        return;
    }

    // eosjs function call: connect to the blockchain
    const signatureProvider = new JsSignatureProvider([privateKey]);
    //const rpc = new JsonRpc(this.props.endpoint);
    const rpc = new JsonRpc('http://127.0.0.1:8888');
    //const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
    const api = new Api({ rpc, signatureProvider });


    try {
      // CREATE ACTION TO PROPOSE
      const updateAuthTransaction = await api.transact({
        actions: [{
          account: 'eosio',
          name: 'updateauth',
          authorization: [{
            actor: account,
            permission: 'active',
          }],
          data: {
            account: account,
            permission: 'owner',
            parent: '',
            auth: {
              keys: [
                {
                  key: publicKey,
                  weight: 1
                }
              ],
              threshold: 1,
              accounts: [],
              waits: []
            }
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
        broadcast: false,
        sign: false
      });
      //transfer.transaction.transaction.max_net_usage_words = 0; // bug fix
      let txHeader = { 
                transaction_header: {
                  expiration: 1583284261,
                  max_net_usage_words: 0,
                }
              };
      const newUpdateAuthTransaction = Object.assign({}, updateAuthTransaction, txHeader );
      // updateAuthTransaction.transaction_header.expiration = 100;
      console.log(newUpdateAuthTransaction)

      // BUILD THE MULTISIG TRANSACTION
      actionData = {
        proposer: account,
        proposal_name: 'goback',
        requested: [
          {
            'actor': 'chestnutmsig',
            'permission': 'security'
          },
          {
            'actor': account,
            'permission': 'chestnut'
          }
        ],
        trx: newUpdateAuthTransaction
      };

      // SEND THE MULTISIG
      try {
        const result = await api.transact({
          actions: [{
            account: 'eosio.msig',
            name: 'propose',
            authorization: [{
              actor: account,
              permission: 'active',
            }],
            data: actionData,
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30,
        });
  
        console.log(result);
        this.getAccountDetails();
      } catch (e) {
        console.log('Caught exception: ' + e);
        if (e instanceof RpcError) {
          console.log(JSON.stringify(e.json, null, 2));
        }
      }

    } catch (error) {
        console.log(error);
    }

    // FROM GITHUB
    // const transfer = await eos.transfer('daniel', 'chestnutmsig', '1.0000 EOS', '', {broadcast: false, sign: false})
    // transfer.transaction.transaction.max_net_usage_words = 0 // bug fix
    // console.log(transfer.transaction.transaction)
    
    // const msig = await eos.contract('eosio.msig')
    
    // const randomName = String(Math.round(Math.random() * 100000)).replace(/[0,6-9]/g, '')
    // const propose = await msig.propose('chestnutmsig', 'jungle.' + randomName, [{actor: 'daniel', permission: 'active'}], transfer.transaction.transaction)
    // console.info(propose)

  }

  // gets table data from the blockchain
  // and saves it into the component state: "accountInfo"
  async getAccountDetails() {
    const rpc = new JsonRpc(this.props.endpoint);
    try {
      // console.log(await rpc.get_account('daniel'));
      // rpc.get_account('daniel').then(result => this.setState({ accountInfo: result.rows }));
      rpc.get_account('daniel').then(result => this.setState({accountInfo: result}));
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.getAccountDetails();
  }

  render() {
    const { accountInfo } = this.state;
    const { classes } = this.props;

    // generate each note as a card
    const generateCard = (accountInfo) => (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="headline" component="h2">
            Welcome {accountInfo.account_name}
          </Typography>
          <Typography variant="subheading">
            Balance: {accountInfo.core_liquid_balance}
          </Typography>
          <Typography variant="subheading">
            Storage: {accountInfo.ram_quota - accountInfo.ram_usage} (Bytes) RAM
          </Typography>
          {
            accountInfo.permissions.map((perm, i) => {
              return  <div  className={"row"} key={i}>
                        <Typography variant="subheading">
                          { perm.perm_name } { perm.required_auth.threshold }
                        </Typography>

                        {
                          perm.required_auth.accounts.map((row, j) => {
                                  return  <div  className={"row"} key={j}>
                                            <Typography variant="subheading">
                                              { row.weight }: { row.permission.actor }@{ row.permission.permission }
                                            </Typography>
                                          </div>
                                })
                        }
                        {
                          perm.required_auth.keys.map((row, j) => {
                            return  <div className={"row"} key={j}>
                                      <Typography variant="subheading">
                                        { row.weight }: { row.key }
                                      </Typography>
                                    </div>
                          })
                        }
                        {
                          perm.required_auth.waits.map((row, j) => {
                            return  <div className={"row"} key={j}>
                                      <Typography variant="subheading">
                                        { row.weight }: { row.wait_sec }
                                      </Typography>
                                    </div>
                            })
                        }
                      </div>
              })
          }
        </CardContent>
      </Card>
    );

    let accountCards = generateCard(accountInfo);

    return (
      <div>

        {accountCards}

        <Paper className={classes.paper}>
          <form onSubmit={this.handleFormEvent}>
            <TextField
              name="account"
              autoComplete="off"
              label="Account"
              margin="normal"
              fullWidth
            />
            <TextField
              name="privateKey"
              autoComplete="off"
              label="Private key"
              margin="normal"
              fullWidth
            />
            <TextField
              name="pubKey"
              autoComplete="off"
              label="Public key"
              margin="normal"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.formButton}
              type="submit">
              Go Back To Normal Account
            </Button>
          </form>
        </Paper>
        <pre className={classes.pre}>
          Below is a list of pre-created accounts information for add/update note:
          <br/><br/>
          accounts = { JSON.stringify(this.props.accounts, null, 2) }
        </pre>
      </div>
    );
  }

}

export default withStyles(styles)(SmartAccount);