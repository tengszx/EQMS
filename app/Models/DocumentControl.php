<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentControl extends Model
{
    protected $fillable = [
        'section',
        'subject',
        'file_name',
        'file_path',
        'document_code'
    ];
}
