import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from '../../services/userService'
import ModalUser from './ModalUser';
import { emitter } from '../../utils/emitter';
import ModalEditUser from './ModalEditUser';

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false, //mặc định ko mở popup
            isOpenModalEditUser: false, //mặc định ko mở popup
            userEdit: {},
        }
    }
    async componentDidMount() {
        await this.getAllUsersFromReact();
        // let response = await getAllUsers('ALL');
        // if (response && response.errCode === 0) {
        //     this.setState({
        //         arrUsers: response.users
        //  })
        //     console.log('check state user 1: ', this.state.arrUsers);//[] callback
        // }
    }
    getAllUsersFromReact = async () => {
        let response = await getAllUsers('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            })
        }
    }
    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
        })
    }
    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }
    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser,
        })
    }
    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if (response && response.errCode !== 0) {
                alert(response.errMessage)
            } else {
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalUser: false
                })
                emitter.emit('EVENT_CLEAR_MODAL_DATA', { 'id': 'your id' })
            }
        } catch (e) {
            console.log(e)
        }
    }
    handleDeleteUser = async (user) => {
        console.log('click delete', user)
        try {
            let res = await deleteUserService(user.id);
            if (res && res.errCode === 0) {
                await this.getAllUsersFromReact();
            }
            else {
                alert(res.errMessage)
            }
        } catch (e) {
            console.log(e)
        }
    }
    handleEditUser = (user) => {
        console.log('check edit user: ', user);
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user,
        })
    }
    doEditUser = async (user) => {
        try {
            let res = await editUserService(user);
            if (res && res.errCode === 1) {
                //1 là thành công, theo định nghĩa bên Nodejs
                this.setState({
                    isOpenModalEditUser: false
                })
                await this.getAllUsersFromReact()
            } else {
                alert(res.errCode)
            }
        } catch (e) {
            console.log(e);
        }
    }
    render() {
        let arrUsers = this.state.arrUsers
        return (
            <div className="user-container">
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {
                    this.state.isOpenModalEditUser &&
                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggleParent={this.toggleUserEditModal}
                        currentUser={this.state.userEdit}
                        editUser={this.doEditUser}
                    />
                }
                <div className='title text-center'>Manage users with Movex</div>
                <div className="mx-1">
                    <button
                        className='btn btn-primary px-3'
                        onClick={() => this.handleAddNewUser()}
                    ><i className="fas fa-plus"></i> Add new user
                    </button>
                </div>
                <div className='users-table mt-3 mx-1'>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                            {arrUsers && arrUsers.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className='btn-edit'
                                                onClick={() => this.handleEditUser(item)}
                                            ><i className="fas fa-pencil-alt"></i></button>
                                            <button className='btn-delete'
                                                onClick={() => this.handleDeleteUser(item)}
                                            ><i className="fas fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>
                </div>
            </div >
        );
    }
}
const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
