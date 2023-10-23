"use client";

import Image from "next/image";
import {ReactFinder} from "./react-finder";
import React, { Component } from 'react';
import * as Finder from "finderjs" ;
import * as uuidv4 from "uuid/v4";
import 'finderjs/example/finderjs.css'

console.log({Component, Finder, uuidv4})

export default function Home() {


    const data = [
        {
            id: 1,
            label: 'Label A',
            children: [
                {
                    id: 10,
                    label: 'Label A1'
                },
                {
                    id: 11,
                    label: 'Label A2'
                }
            ]
        }, {
            id: 2,
            label: 'Label B'
        }
    ];


    return (
        <main className="p-3 bg-white">
            <ReactFinder
                className=""
                data={data}/>
        </main>
    );
}
