<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Customer
Route::resource('customer', 'CustomerController');
Route::view('/customer-index', 'customer.index');
Route::post('/customer/update/{id}',['uses' => 'CustomerController@update','as' => 'customer.update']);

// Product
Route::resource('product', 'ProductController');
Route::post('/product/update/{id}',['uses' => 'ProductController@update','as' => 'product.update']);
Route::view('/product-index', 'product.index');

// Pcspecs
Route::resource('pcspec', 'PcspecController');
Route::post('/pcspec/update/{id}',['uses' => 'PcspecController@update','as' => 'pcspec.update']);
Route::view('/pcspec-index', 'pcspec.index');
