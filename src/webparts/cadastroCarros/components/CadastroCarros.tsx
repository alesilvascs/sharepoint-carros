import * as React from 'react';
import styles from './CadastroCarros.module.scss';
import { ICadastroCarrosProps } from './ICadastroCarrosProps';
import { escape } from '@microsoft/sp-lodash-subset';

import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
 
export default class CadastroCarros extends React.Component<ICadastroCarrosProps, {}> {
  public render(): React.ReactElement<ICadastroCarrosProps> {
    return (
      <div className={styles.SpFxCrud}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <p className={styles.description}>{escape(this.props.description)}</p>
              <div className={styles.itemField}>
                <div className={styles.fieldLabel}>ID:</div>
                <input type="text" id='itemId'/>
              </div>
              <div className={styles.itemField}>
                <div className={styles.fieldLabel}>Modelo</div>
                <input type="text" id='Title'/>
              </div>
              <div className={styles.itemField}>
                <div className={styles.fieldLabel}>Marca</div>
                <input type="text" id='marca'/>
              </div>
              <div className={styles.itemField}>
                <div className={styles.fieldLabel}>Ano</div>
                <input type="text" id='ano' />
              </div>
              <div className={styles.itemField}>
                <div className={styles.fieldLabel}>All Items:</div>
                <div id="allItems" />
              </div>
              <div className={styles.buttonSection}>
                <div className={styles.button}>
                  <span className={styles.label} onClick={this.createItem}>Create</span>
                </div>
                <div className={styles.button}>
                  <span className={styles.label} onClick={this.getItemById}>Read</span>
                </div>
                <div className={styles.button}>
                  <span className={styles.label} onClick={this.getAllItems}>Read All</span>
                </div>
                <div className={styles.button}>
                  <span className={styles.label} onClick={this.updateItem}>Update</span>
                </div>
                <div className={styles.button}>
                  <span className={styles.label} onClick={this.deleteItem}>Delete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


// Create Item
  private createItem = (): void => {
    const body: string = JSON.stringify({
      'Title': (document.getElementById("Title") as HTMLInputElement).value,
      'ano': (document.getElementById("ano")as HTMLInputElement).value,
      'marca': (document.getElementById("marca")as HTMLInputElement).value,
    });
    
    this.props.context.spHttpClient.post(`${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Carros')/items`,
      SPHttpClient.configurations.v1, {
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'Content-type': 'application/json;odata=nometadata',
        'odata-version': ''
      },
      body: body
    })
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
           void response.json().then((responseJSON) => {
            console.log(responseJSON);
             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
             // @ts-ignore
             document.getElementById("Title").value = "";
             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
             // @ts-ignore
                  document.getElementById("ano").value = "";
             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
             // @ts-ignore
                  document.getElementById("marca").value = "";
            alert(`Item created successfully with ID: ${responseJSON.ID}`);
          });
        } else {
          void response.json().then((responseJSON) => {
            console.log(responseJSON);
            alert(`Something went wrong! Check the error in the browser console.`);
          });
        }
      }).catch((error: never) => {
        console.log(error);
      });
  }
 
  
// Get Item by ID
  private getItemById = (): void => {
    const id  = (document.getElementById('itemId')as HTMLInputElement).value;
    if (parseInt(id) > 0) {
      this.props.context.spHttpClient.get(this.props.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Carros')/items(${id})`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'odata-version': ''
          }
        })
        .then((response: SPHttpClientResponse) => {
          if (response.ok) {
            void response.json().then((responseJSON) => {
              console.log(responseJSON);
              (document.getElementById('Title')as HTMLInputElement).value = responseJSON.Title;
              (document.getElementById('ano')as HTMLInputElement).value = responseJSON.ano;
              (document.getElementById('marca')as HTMLInputElement).value = responseJSON.marca;
            });
          } else {
            void response.json().then((responseJSON) => {
              console.log(responseJSON);
              alert(`Something went wrong! Check the error in the browser console.`);
            });
          }
        }).catch((error: any) => {
          console.log(error);
        });
    }
    else {
      alert(`Please enter a valid item id.`);
    }
  }
 
  
// Get all items
  private getAllItems = (): void => {
    //this.props.context.spHttpClient.get(this.props.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Carros')/items`,
    this.props.context.spHttpClient.get(this.props.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Carros')/items`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'odata-version': ''
        }
      })
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          void response.json().then((responseJSON) => {
            let html = `<table>
                            <tr>
                                <th>ID</th>
                                <th>Modelo</th>
                                <th>Marca</th>
                                <th>Ano</th>
                            </tr>`;
            responseJSON.value.map((item: { ID: any; Title: any; ano: any; marca: any}, index: any) => {
              html += `<tr>
                          <td>${item.ID}</td>
                          <td>${item.Title}</td>
                          <td>${item.marca}</td>
                          <td>${item.ano}</td>
                          <td><button onclick= "this.editar(${item.ID})" >Editar ${item.ID}</button> </td>
                        </tr>`;
            });
            html += `</table>`;
            document.getElementById("allItems").innerHTML = html;
            console.log(responseJSON);
          });
        } else {
          void response.json().then((responseJSON) => {
            console.log(responseJSON);
            alert(`Something went wrong! Check the error in the browser console.`);
          });
        }
      }).catch((error: any) => {
        console.log(error);
      });
  }
 
  
// Update Item
  private updateItem = (): void => {
    const id  = (document.getElementById('itemId')as HTMLInputElement).value;
    const body: string = JSON.stringify({
      'Title': (document.getElementById("Title")as HTMLInputElement).value,
      'ano': (document.getElementById("ano")as HTMLInputElement).value,
      'marca': (document.getElementById("marca")as HTMLInputElement).value
    });
    if (parseInt(id) > 0) {
      this.props.context.spHttpClient.post(`${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Carros')/items(${id})`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'Content-type': 'application/json;odata=nometadata',
            'odata-version': '',
            'IF-MATCH': '*',
            'X-HTTP-Method': 'MERGE'
          },
          body: body
        })
        .then((response: SPHttpClientResponse) => {
          if (response.ok) {
            alert(`Item with ID: ${id} updated successfully!`);
          } else {
            void response.json().then((responseJSON) => {
              console.log(responseJSON);
              alert(`Something went wrong! Check the error in the browser console.`);
            });
          }
        }).catch((error: never) => {
          console.log(error);
        });
    }
    else {
      alert(`Please enter a valid item id.`);
    }
  }
 
  
// Delete Item
  private deleteItem = (): void => {
    const id: number = parseInt((document.getElementById('itemId')as HTMLInputElement).value);
    if (id > 0) {
      this.props.context.spHttpClient.post(`${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Carros')/items(${id})`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'Content-type': 'application/json;odata=verbose',
            'odata-version': '',
            'IF-MATCH': '*',
            'X-HTTP-Method': 'DELETE'
          }
        })
        .then((response: SPHttpClientResponse) => {
          if (response.ok) {
            alert(`Item ID: ${id} deleted successfully!`);
          }
          else {
            alert(`Something went wrong!`);
            console.log(response.json());
          }
        });
    }
    else {
      alert(`Please enter a valid item id.`);
    }
  }
}