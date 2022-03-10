const React = require('react')
const { A, Box, Email, Item, Image, Span } = require('react-html-email')

const matchedEmail = (
  <Email title="email titel">
    <Item>
      Dear students, We are writing to you because you have expressed interest
      in studying with other students. We are so glad you reached out! Studying
      with peers is known to be an effective learning tool, but whether you are
      learning online or in-person it can be challenging, especially in large
      classes, to find study partners. Study partners should take it from here
      and get in touch with each other about when and how to study together. You
      can just hit “reply all” to get connected with each other. Based on
      student feedback from last semester- this semester we are offering study
      partners the opportunity to meet with LSC peer study skills tutors to help
      facilitate introductions and get you launched. Self-enroll in the study
      skills tutors’ Canvas site to see when drop- in hours are held, you can
      show up any time that works for your group. You can also drop in to see
      the study skills tutors if you have questions about getting started with
      your group. Due to privacy rules we are not able to disclose which classes
      the student(s) receiving this email are taking, but you have been matched
      because you expressed interest in finding study partners for the same
      course. So, your first group assignment will be to figure it out! Whether
      you will be studying together in-person or online, use the LSC’s tips for
      setting your group’s agenda and making the most out of studying together.
      Consider working together at a time when you can use course office hours
      or LSC tutoring to answer questions that may arise! If you’d like more
      info about studying together please contact LSC Study Partners
      lscstudypartners@cornell.edu We will be following up later in the semester
      to find out how it’s going. Happy studying
    </Item>{' '}
  </Email>
)

const Matched = () => {
  return <> {matchedEmail} </>
}

export { Matched }
