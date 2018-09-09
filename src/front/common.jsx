import React from 'react'
import propTypes from 'prop-types'

import style from './style.css'

export const Section = (props) => (
  <section className={style.section}>
    <h2 className={style.title}>
      {props.title}
    </h2>
    <>
      {props.children}
    </>
  </section>
)

Section.propTypes = {
  title: propTypes.string.isRequired,
  children: propTypes.node
}
