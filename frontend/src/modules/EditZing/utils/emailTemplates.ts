const matched = `
<p>Dear Students,</p>
<p>
  We are writing to you because you have expressed interest in studying with
  other students. We are so glad you reached out!
</p>
<p>
  <strong>THE NEXT STEP IS UP TO YOU:</strong> You need to “reply all” to get
  connected with each other and make plans for when and how to study together.
  <strong><em>Partners need to get in touch with each other by using “reply all”
  to this email to get your study group launched.</em></strong>
</p>
<p>
  Due to privacy rules we are not able to disclose which classes the student(s)
  receiving this email are taking, but you have been matched because you
  expressed interest in finding study partners for the same course. Although
  it’s a little strange, your first group assignment will be to figure out what
  course you’ve been matched on.
</p>
<p>
  Whether you will be
  <a href="https://lsc.cornell.edu/studying-together/">studying together in-person or online</a>,
  use the LSC’s tips for setting your group’s agenda and making the most out of
  studying together. Consider working together at a time when you can use
  instructor or TA
  <a href="http://lsc.cornell.edu/how-to-study/office-hours/">office hours</a>
  to answer questions that may arise.
</p>
<p>
  It is the responsibility of you and your study partners to understand and
  adhere to your instructor's expectations regarding group work. If you are not
  sure, ask! See
  <a href="https://provost.cornell.edu/leadership/vp-undergrad-ed/academic-integrity/"
  >https://provost.cornell.edu/leadership/vp-undergrad-ed/academic-integrity/</a>
  for more info.
</p>
<p>
  If you’d like more info about studying together please contact LSC Study Partners
  <a href="mailto:lscstudypartners@cornell.edu">lscstudypartners@cornell.edu</a>.
  We will be following up later in the semester to find out how it’s going.
</p>
<p>Happy studying!</p>
`

const firstNoMatch = (className: string) => {
  return `< div > Dear Student, </>
      < br >
      <br>
      <div>
      We are writing to let you know that we are still working on finding study partners
    for the class(es) you requested: <b>${className} </b>. We'll be in touch soon with an update!
      In the meantime, the < a href = "http://lsc.cornell.edu/" > LSC website < /a> offers lots of
      information about general study skills, learning effectively, and tutoring.
    < /div>`
}

const secondNoMatch = () => {
  return `<div> Dear Student, </div>
      <br> 
      <br> 
    <div> 
      We are writing to follow up and let you know that unfortunately we have not 
      been successful, so far, in finding study partners for the class(es) you 
      requested. We’ll be in touch again if another student requests study partners
      for your class(es). In the meantime, the LSC website offers lots of information
      about general study skills, learning effectively, and tutoring. 
    </div>`
}

const addStudent = () => {
  return `<div> Dear Students,  </div>  
      <br> 
      <br> 
    
    <div> 
      We are writing to check in about your study partners. Although our hope is to
      form groups with the same composition for the entire semester, that’s not 
      always possible. 
      Another student has requested study partners for your class, and we have 
      not been able to find a match for them. We’d like to ask that you please 
      consider adding this fellow student to your group. Please let us know if you 
      have any questions or concerns. If we don’t hear back from you we’ll connect
      you all via email. Thank you! 
    </div>
   `
}

const lateAddStudent = () => {
  return ` 
    <div> Dear Students, </div> 
      <br> 
      <br> 
    <div> 
      We are writing to check in about your study partners. Although our hope is to
      form groups with the same composition for the entire semester, that’s not 
      always possible. 
          <br> 
          <br> 
      Another student has requested study partners for your class, and we have 
      not been able to find a match for them. Although it’s late in the semester, we
      are hoping that you would please consider adding this fellow student to your 
      group. Please let us know if you have any questions or concerns. We know 
      that it can be great to get new perspectives when you’re studying, and we 
      also understand if at this point in the semester your group feels that adding 
      another student would not be beneficial. If we don’t hear back from you in 
      the next 3 business days, we’ll connect you all via email. Thank you!
    </div>`
}

// // this one is hard, probably a v2 feature that requires more thought and designs
// const askJoinGroup = (newStudent: string, studentsRaw: string[]) => {
//   const parseNames = () => {
//     let res = ''
//     studentsRaw.forEach((e: string) => {
//       res += ', ' + e
//     })

//     return res
//   }

//   const students = parseNames()

//   return `
//     <div> Dear students,  </div>
//     <br>
//     <br>
//     <div>
//     We are writing to you because you have expressed interest in studying with
//     other students. We are so glad you reached out! Studying with peers is
//     known to be an effective learning tool, but whether you are learning online or
//     in-person it can be challenging, especially in large classes, to find study
//     partners.
//     </div>
//     <br>
//     <div>
//     <b> ${newStudent} </b>, within the past few days we tried to match
//     you with another student who requested a study partner for the same
//     class(es) you listed but haven’t had any luck. Fortunately, a small group that
//     we matched recently is happy to have another student join them in studying.
//     Thank you<b>${students}</b>!
//     </div>
//     <br>
//     <div>
//     (Due to privacy rules we are not able to disclose which classes the student(s)
//     receiving this email are taking, but you have been matched because you
//     expressed interest in finding study partners for the same course.)
//     </div>
//     <br>
//     <div>
//     Whether you will be studying together in -person or online, use the LSC’s tips
//     for setting your group’s agenda and making the most out of studying
//     together.Consider working together at a time when you can use course
//     office hours or LSC tutoring to answer questions that may arise!
//     </div>
//     <br>
//     <div>
//     If you’d like more info about studying together please contact LSC Study
//     Partners lscstudypartners@cornell.edu  We will be following up later in the
//     semester to find out how it’s going.
//     </div>
//     <br>
//     <br>
//     Happy studying!`
// }

const checkIn = `
<p>Dear students,</p>
<p>
  According to our records we matched you as study partners for a class you
  requested other students to study with.
</p>
<p>
  We are writing to check in. We hope your group has been able to meet and that
  you are finding it useful to study with others!
</p>
<p>
  We know that sometimes matched students are not able to find a time to meet
  that works for everyone, or one person is auditing and decides not to do group
  work after all, or someone drops the class, and so on and so forth. If you
  need to be re-grouped please DO NOT fill out the form again. Just reply to
  this email to let us know what’s going on, and we’ll try to help.
</p>
<p>Take care, The LSC Staff</p>
`

// const custom = (body: string) => {
//   return `<div> Dear Student(s), </div>
//       <br>
//       <br>

//       <div>
//     ${body}
//     </div>`
// }

export enum TemplateName {
  MATCHED = 'Share matched results',
  FIRST_NO_MATCH = 'First no match notification',
  SECOND_NO_MATCH = 'Second no match notification',
  ADD_STUDENT = 'Request to add student to group',
  LATE_ADD_STUDENT = 'Request to add student to group (late)',
  ASK_JOIN_GROUP = 'Ask to join group',
  CHECK_IN = 'Check in with groups',
}

export const getBody = (templateName: TemplateName, className: string) => {
  switch (templateName) {
    case TemplateName.MATCHED:
      return matched
    case TemplateName.FIRST_NO_MATCH:
      return firstNoMatch(className)
    case TemplateName.SECOND_NO_MATCH:
      return secondNoMatch()
    case TemplateName.ADD_STUDENT:
      return addStudent()
    case TemplateName.LATE_ADD_STUDENT:
      return lateAddStudent()
    case TemplateName.ASK_JOIN_GROUP:
      throw new Error('Out of scope for v1')
    case TemplateName.CHECK_IN:
      return checkIn
    default:
      throw new Error('Template not found')
  }
}
