// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {readFileSync} from 'fs';
import {resolve} from 'path';
import * as snapshot from 'snap-shot-it';
import {describe, it} from 'mocha';
import {expect} from 'chai';
import {Version} from '../../src/version';
import {GoMod} from '../../src/updaters/go/go-mod';

const fixturesPath = './test/updaters/fixtures/go';

describe('go.mod', () => {
  describe('updateContent', () => {
    it('refuses to update without versions', async () => {
      const oldContent = readFileSync(
        resolve(fixturesPath, './go.mod'),
        'utf8'
      ).replace(/\r\n/g, '\n');
      const updater = new GoMod({
        version: Version.parse('v2.3.4'),
      });
      expect(() => {
        updater.updateContent(oldContent);
      }).to.throw();
    });
    it('updates dependencies', async () => {
      const oldContent = readFileSync(
        resolve(fixturesPath, './go.mod'),
        'utf8'
      ).replace(/\r\n/g, '\n');
      const updatedVersions = new Map();
      updatedVersions.set('example.com/foo/bar/v2', Version.parse('v2.1.3'));
      updatedVersions.set(
        'github.com/stretchr/testify',
        Version.parse('v1.2.4')
      );

      const updater = new GoMod({
        version: Version.parse('v2.3.4'),
        versionsMap: updatedVersions,
      });
      const newContent = updater.updateContent(oldContent);
      snapshot(newContent);
    });
    it('updates a commit dependency', async () => {
      const oldContent = readFileSync(
        resolve(fixturesPath, './go.mod'),
        'utf8'
      ).replace(/\r\n/g, '\n');
      const updatedVersions = new Map();
      updatedVersions.set('example.com/car/dar', Version.parse('v0.1.2'));

      const updater = new GoMod({
        version: Version.parse('v2.3.4'),
        versionsMap: updatedVersions,
      });
      const newContent = updater.updateContent(oldContent);
      snapshot(newContent);
      expect(newContent).to.include('example.com/car/dar v0.1.2 // indirect');
    });
  });
});
