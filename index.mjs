import { CloudantV1 } from '@ibm-cloud/cloudant'

// get the replication docId as a command-line parameter
const argv = process.argv
if (argv.length !==3) {
  console.error('Syntax: npm run start <docId>')
  process.exit(1)
}
const docId = argv[2]

// entry point
const main = async () => {
  let response

  // Cloudant client - configured by environment variables
  const client = CloudantV1.newInstance({})

  // fetch the scheduler document
  try {
    response = await client.getSchedulerDocument({
      docId
    })
  } catch (e) {
    console.error('Failed to fetch replication scheduler doc')
    console.error(e.status, e.result)
    process.exit(2)
  }

  // if we have a jobId
  const jobId = response.result.id
  if (jobId) {
    
    // fetch the replication scheduler job
    console.error(`Replication is working: job id ${jobId}`)
    try {
      response = await client.getSchedulerJob({
        jobId
      })
      console.log(JSON.stringify(response.result, null, '  '))
      process.exit(0)
    } catch (e) {
      console.error('Failed to fetch replication scheduler job')
      console.error(e.status, e.result)
      process.exit(3)
    }
  } else {
    // if we reach this point the replication is not running (jobId === null)
    console.error(`Replication is NOT working: job id ${jobId}`)
    console.log(JSON.stringify(response.result, null, '  '))
    // !!!
    // put your user-specific actions here to communicate that a 
    // replication has failed
    // !!
    process.exit(4)
  }
}
 
main()
