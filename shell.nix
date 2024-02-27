{ pkgs ? import <nixpkgs> {} }:

with pkgs;
let bun_1_0_24 = pkgs.bun.overrideAttrs (oldAttrs: with pkgs; rec {
    version = "1.0.24";
    src = passthru.sources.${stdenvNoCC.hostPlatform.system} or (throw "Unsupported system: ${stdenvNoCC.hostPlatform.system}");
    passthru = oldAttrs.passthru // {
      sources = oldAttrs.passthru.sources // {
        "aarch64-darwin" = fetchurl {
          url = "https://github.com/oven-sh/bun/releases/download/bun-v${version}/bun-darwin-aarch64.zip";
          hash = "";
        };
        "aarch64-linux" = fetchurl {
          url = "https://github.com/oven-sh/bun/releases/download/bun-v${version}/bun-linux-aarch64.zip";
          hash = "";
        };
        "x86_64-darwin" = fetchurl {
          url = "https://github.com/oven-sh/bun/releases/download/bun-v${version}/bun-darwin-x64.zip";
          hash = "";
        };
        "x86_64-linux" = fetchurl {
          url = "https://github.com/oven-sh/bun/releases/download/bun-v${version}/bun-linux-x64.zip";
          hash = "sha256-IPQ4W8B4prlLljf7OviGpYtqNxSxMB1kHCMOrnbxldw=";
        };
      };
    };
  });
in
(pkgs.buildFHSEnv {
  name = "bun_devenv";

  targetPkgs = pkgs: (with pkgs; [
    bun_1_0_24
  ]);
  runScript = "bash";
  # profile = ". shell.sh";
}).env
