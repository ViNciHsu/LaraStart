<template>
    <div class="container">
        <div class="row mt-5" v-if="$gate.isAdmin()">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Users Table</h3>

                        <div class="card-tools">
                            <!--<button class="btn btn-success" data-toggle="modal" data-target="#addNew">Add New <i class="fa fa-user-plus"></i></button>-->
                            <button class="btn btn-success" @click="newModal()">Add New <i class="fa fa-user-plus"></i></button>

                        </div>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body table-responsive p-0">
                        <table class="table table-hover">
                            <tbody>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Register At</th>
                                <th>Modify</th>
                            </tr>

                            <tr v-for="user in users" :key="user.id">
                                <td>{{user.id}}</td>
                                <td>{{user.name}}</td>
                                <td>{{user.email}}</td>
                                <td>{{user.type | upText}}</td>
                                <td>{{user.created_at | myDate}}</td>
                                <td>
                                    <a href="#" @click="editModal(user)">
                                        <i class="fa fa-edit blue"></i>
                                    </a>
                                    /
                                    <a href="#" @click="deleteUser(user.id)">
                                        <i class="fa fa-trash red"></i>
                                    </a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" v-show="!editmode" id="addNewLagel">Add New</h5>
                        <h5 class="modal-title" v-show="editmode" id="updateLabel">Update User's Info</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <!-- form -->
                    <form @submit.prevent="editmode ? updateUser() : createUser()">
                    <div class="modal-body">
                        <div class="form-group">
                            <input v-model="form.name" type="text" name="name" placeholder="name"
                                   class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                            <has-error :form="form" field="name"></has-error>
                        </div>

                        <div class="form-group">
                            <input v-model="form.email" type="email" name="email" placeholder="email"
                                      class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                            <has-error :form="form" field="email"></has-error>
                        </div>

                        <div class="form-group">
                            <textarea v-model="form.bio" name="bio" id="bio" placeholder="Short bio for users (Optional)"
                                      class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                            <has-error :form="form" field="bio"></has-error>
                        </div>

                        <div class="form-group">
                            <select v-model="form.type" id="type" name="type"
                                    class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
                                <option value="">Select User Role</option>
                                <option value="admin">Admin</option>
                                <option value="user">Standard User</option>
                                <option value="author">Author</option>
                            </select>
                            <has-error :form="form" field="type"></has-error>
                        </div>

                        <div class="form-group">
                            <input v-model="form.password" type="password" name="password" id="password" placeholder="password"
                                   class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                            <has-error :form="form" field="password"></has-error>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        <button v-show="editmode" type="submit" class="btn btn-success">Update</button>
                        <button v-show="!editmode" type="submit" class="btn btn-primary">Create</button>
                    </div>
                    </form>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                // 先讓editmode為false,再根據新增或修改來改變顯示的label和按鈕名稱
                editmode : false,
                users : {},
                form : new Form({
                    id : '',// 此處有從DB獲取id,methods內才能使用id
                    name : '',
                    email : '',
                    password : '',
                    type : '',
                    bio : '',
                    photo : ''
                })
            }
        },
        methods:{
            updateUser(id){
                // Progress bar start
                this.$Progress.start();
                // console.log('editing data');
                this.form.put('api/user/'+this.form.id)
                    .then(() => {
                        // success
                        $('#addNew').modal('hide');// 修改成功就收起modal
                        swal(
                            'Updated!',
                            'Information has been updated.',
                            'success'
                        );
                        this.$Progress.finish();
                        // 定義在app.js,做完某動作後刷新頁面
                        Fire.$emit('AfterCreate');
                    })
                    .catch(() => {
                        // fail
                        // Progress bar start
                        this.$Progress.fail();
                    })
            },
            editModal(user){
                this.editmode = true;
                this.form.reset();
                $('#addNew').modal('show');
                // 點擊edit會出現對應的使用者資料
                this.form.fill(user);
            },
            newModal(){
                this.editmode = false;
                this.form.reset();
                $('#addNew').modal('show');

            },
            // delete user by id
            deleteUser(id){
                swal({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {

                    // send request to the server
                    if(result.value) {
                        this.form.delete('api/user/' + id).then(() => {
                            swal(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            )
                            // 定義在app.js,做完某動作後刷新頁面
                            Fire.$emit('AfterCreate');
                        }).catch(() => {
                            swal(
                                'Failed!',
                                'There was something wrong.',
                                'warning'
                            );
                        });
                    }
                })
            },
            // display users list
            loadUsers(){
                // 如果是管理者才會顯示user資料
                if(this.$gate.isAdmin()) {
                    axios.get("api/user").then(({data}) => (this.users = data.data));
                }
            },
            // create new user
            createUser(){
                // Progress bar start
                this.$Progress.start();
                // submit the form via a POST request
                this.form.post('api/user')
                .then(()=>{
                    // 使用CustomEvent在新增後發送HTTP請求
                    Fire.$emit('AfterCreate');
                    // modal在發送請求後關起來
                    $('#addNew').modal('hide');
                    toast({
                        type: 'success',
                        title: 'User Created in successfully'
                    });
                    // Progress bar finish
                    this.$Progress.finish();
                })
                .catch(()=>{
                    // progress bar show the red bar
                    this.$Progress.fail();
                })
            }
        },

        created() {
            this.loadUsers();
            // send HTTP Request by CustomEvent
            Fire.$on('AfterCreate',() => {
                this.loadUsers();
            });
            // Send HTTP Request Every 3 Seconds to Update Data,但浪費效能
            // setInterval(() => this.loadUsers(),3000)
        }
    }
</script>
