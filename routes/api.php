<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// 快速生成api相關CRUD的function
Route::apiResources([
    'user' => 'API\UserController'
]);
// 顯示profile內容
Route::get('profile','API\UserController@profile');
Route::put('profile','API\UserController@updateProfile');
