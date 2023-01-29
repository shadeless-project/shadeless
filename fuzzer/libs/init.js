const { PathQL, PacketQL, ToolNoteQL, PacketReader } = require('@drstrain/shadeless-lib');

const defaultOpts = {
  choosingProject: 'iims',
  bodyDir: __dirname + '/../../files/',
  ...require('./creds.json'),
}

defaultOpts['fileLocation'] = `${defaultOpts['bodyDir']}/${defaultOpts['choosingProject']}`;

function newPathQL(newOpt = {}) { return new PathQL({ ...defaultOpts, newOpt }); }
function newPacketQL(newOpt = {}) { return new PacketQL({ ...defaultOpts, newOpt }); }
function newReader(newOpt = {}) { return new PacketReader({ ...defaultOpts, newOpt }); }
function newToolNote(newOpt = {}) { return new ToolNoteQL({ ...defaultOpts, newOpt }); }

module.exports = {
  newPathQL,
  newPacketQL,
  newReader,
  newToolNote,
  defaultOpts,
}