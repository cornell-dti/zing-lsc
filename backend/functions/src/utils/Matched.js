const React = require('react')
const { A, Box, Email, Item, Image, Span } = require('react-html-email')

const MyEmail = () => {
  const matchedEmail = (
    <Box>
      <Email title="email title">
        <Item>
          Dear students, Whether you will be studying together in-person or
          online, use the LSC’s tips for setting your group’s agenda and making
          the most out of studying together. Consider working together at a time
          when you can use course office hours or LSC tutoring to answer
          questions that may arise! If you’d like more info about studying
          together please contact LSC Study Partners
          lscstudypartners@cornell.edu We will be following up later in the
          semester to find out how it’s going. Happy studying
        </Item>
      </Email>
    </Box>
  )

  return <> {matchedEmail} </>
}

export default MyEmail
