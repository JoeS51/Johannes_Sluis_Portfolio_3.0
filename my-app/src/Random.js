import React, { useState } from 'react'

import Grid from './Hello'
import ResponsiveAppBar from './Components/Navbar'
import Experience from './Experience'
import Drawing from './Drawing'
import Signature from './Components/Signature'
import { WavyBackground } from './Components/Wave'

export default function Random() {
    return (
      <div>
        <ResponsiveAppBar />
        <Grid />
        <div className="App">
          <Signature />
        </div>

        <WavyBackground className="max-w-4xl mx-auto pb-40">
      <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
        Hero waves are cool
      </p>
      <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
        Leverage the power of canvas to create a beautiful hero section
      </p>
    </WavyBackground>
      </div>
    )
  }