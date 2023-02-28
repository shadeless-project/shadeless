#!/bin/bash

chown -R shadelessuser:shadelessuser /files/
exec runuser -u shadelessuser "$@"
