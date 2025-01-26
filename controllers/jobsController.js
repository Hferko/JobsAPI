const Job = require('../models/JobModel')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError, } = require('../errors')

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userID }).sort('createdAt')
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs })
}

const getJob = async (req, res) => {
  const { user: { userID }, params: { id: jobId } } = req

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userID
  })

  if (!job) {
    throw new NotFoundError(`Nem található állás ezzel az _id-vel: ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userID },
    params: { id: jobId } } = req

  if (company === '' || position === '') {
    throw new BadRequestError('Nem lehet üres sem Company sem a Position érték')
  }

  const job = await Job.findOneAndUpdate({
    _id: jobId,
    createdBy: userID
  }, req.body, { new: true, runValidators: true })

  if (!job) {
    throw new NotFoundError(`Nem található állás ezzel az _id-vel: ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
  const { user: { userID }, params: { id: jobId } } = req

  const job = await Job.findOneAndDelete({
    _id: jobId,
    createdBy: userID
  })

  if (!job) {
    throw new NotFoundError(`Nem található állás ezzel az _id-vel: ${jobId}`)
  }
  res.status(StatusCodes.OK).send(`A ${job.position} állás törölve`)
}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
}
