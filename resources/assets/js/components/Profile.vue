<style>
.widget-user-header{
    background-position: center center;
    background-size: cover;
    height: 500px;
}

.activity{
    /*margin-left: 10%;*/
}
</style>
<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12 mt-3">
                <div class="card card-widget widget-user">
                    <!-- Add the bg color to the header using any of the bg-* classes -->
                    <div class="widget-user-header text-white" style="background-image:url('./img/user-cover.jpg')">
                        <h3 class="widget-user-username">Elizabeth Pierce</h3>
                        <h5 class="widget-user-desc">Web Designer</h5>
                    </div>
                    <div class="widget-user-image">
                        <img class="img-circle" src="" alt="User Avatar">
                    </div>
                    <div class="">
                        <div class="row">
                            <div class="col-sm-4 border-right">
                                <div class="description-block">
                                    <h5 class="description-header">3,200</h5>
                                    <span class="description-text">SALES</span>
                                </div>
                                <!-- /.description-block -->
                            </div>
                            <!-- /.col -->
                            <div class="col-sm-4 border-right">
                                <div class="description-block">
                                    <h5 class="description-header">13,000</h5>
                                    <span class="description-text">FOLLOWERS</span>
                                </div>
                                <!-- /.description-block -->
                            </div>
                            <!-- /.col -->
                            <div class="col-sm-4">
                                <div class="description-block">
                                    <h5 class="description-header">35</h5>
                                    <span class="description-text">PRODUCTS</span>
                                </div>
                                <!-- /.description-block -->
                            </div>
                            <!-- /.col -->
                        </div>
                        <!-- /.row -->
                    </div>
                </div>

                <div class="card-widget widget-user">
                    <div class="card">
                        <div class="card-header p-2">
                            <ul class="nav nav-pills">
                                <li class="nav-item"><a class="nav-link" href="#activity" data-toggle="tab">Activity</a></li>
                                <li class="nav-item"><a class="nav-link active show" href="#settings" data-toggle="tab">Settings</a></li>
                            </ul>
                        </div><!-- /.card-header -->
                        <div class="card-body">
                            <div class="tab-content">
                                <div class="tab-pane" id="activity">
                                    <div class="col-md-12">
                                        <h1 class="">Display User Activity</h1>
                                    </div>
                                </div>

                                <div class="tab-pane active show" id="settings">
                                    <form class="form-horizontal">

                                        <div class="form-group">
                                            <label for="name" class="col-sm-2 control-label">Name</label>
                                            <div class="col-sm-12">
                                                <input type="name" v-model="form.name" class="form-control"  id="name" placeholder="name" :class="{ 'is-invalid': form.errors.has('name') }">
                                                <has-error :form="form" field="name"></has-error>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="email" class="col-sm-2 control-label">Email</label>
                                            <div class="col-sm-12">
                                                <input type="email" v-model="form.email" class="form-control" id="email" placeholder="email" :class="{ 'is-invalid': form.errors.has('email') }">
                                                <has-error :form="form" field="email"></has-error>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="inputExperience" class="col-sm-2 control-label">Experience</label>
                                            <div class="col-sm-12">
                                                <textarea class="form-control" id="inputExperience" placeholder="Experience"></textarea>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="photo" class="col-sm-2 control-label">Profile Photo</label>
                                            <div class="col-sm-12">
                                                <input type="file" @change="updateProfile" class="form-input" id="photo" name="photo">
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="password" class="col-sm-12 control-label">Password (leave empty if not changing)</label>
                                            <div class="col-sm-12">
                                                <input type="password" v-model="form.password" class="form-control" id="password" placeholder="password" :class="{ 'is-invalid': form.errors.has('password') }">
                                                <has-error :form="form" field="password"></has-error>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <div class="col-sm-offset-2 col-sm-12">
                                                <!-- 加上prevent不會刷新頁面-->
                                                <button @click.prevent="updateInfo" type="submit" class="btn btn-success">Update</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <!-- /.tab-pane -->
                            </div>
                            <!-- /.tab-content -->
                        </div><!-- /.card-body -->
                    </div>
                    <!-- /.nav-tabs-custom -->
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
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
        mounted() {
            console.log('Component mounted.')
        },
        methods:{
            updateInfo(){
                this.$Progress.start();
                this.form.put('api/profile/')
                    .then(()=>{

                        this.$Progress.finish();
                    })
                    .catch(()=>{
                        this.$Progress.fail();
                    })
            },
            // file Upload with Base64
            updateProfile(e){
                // console.log('uploading');
                let file = e.target.files[0];
                console.log(file);
                let reader = new FileReader();

                // Checking File Size While Uploading Limit to less than 2MB
                if(file['size'] < 2111775) {
                    reader.onloadend = (file) => {
                        // console.log('RESULT',reader.result)
                        this.form.photo = reader.result;
                    };
                    reader.readAsDataURL(file);
                }else{
                    swal({
                        type: 'error',
                        title: 'Oops...',
                        text: 'You are uploading a large file !',
                    })
                }
            }
        },

        created() {
            axios.get("api/profile")
                .then(({ data }) => (this.form.fill(data)));
        }
    }
</script>
