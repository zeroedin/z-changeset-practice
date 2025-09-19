interface Release {
  version: string;
  url: string;
}

interface ReleasesData {
  releases: Release[];
  generatedAt: string;
}

// Semantic version comparison function
function compareSemver(a: string, b: string): number {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);
  
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = aParts[i] || 0;
    const bPart = bParts[i] || 0;
    
    if (aPart < bPart) return -1;
    if (aPart > bPart) return 1;
  }
  
  return 0;
}

// Check if version is >= minimum version
function isVersionAtLeast(version: string, minimumVersion: string): boolean {
  return compareSemver(version, minimumVersion) >= 0;
}

export async function loadVersions(releasesJsonUrl: string, targetId: string): Promise<void> {
  const response = await fetch(releasesJsonUrl);
  if (!response.ok) {
    console.error(`HTTP error! status: ${response.status}`);
    return;
  }
  const data: ReleasesData = await response.json();
  
  const versionList = document.getElementById(targetId);
  if (!versionList) {
    console.error(`Version list element not found with id: ${targetId}`);
    return;
  }

  const ul = document.createElement('ul');
  versionList.append(ul);
  
  // Filter releases to only include versions >= 0.4.0
  const filteredReleases = data.releases.filter(release => {
    const version = release.version.replace('v', '');
    return isVersionAtLeast(version, '0.4.0');
  });
  
  // Sort releases in descending order (newest first) using semantic versioning
  const sortedReleases = filteredReleases.sort((a, b) => {
    const aVersion = a.version.replace('v', '');
    const bVersion = b.version.replace('v', '');
    return compareSemver(bVersion, aVersion); // Reverse order for descending
  });

  sortedReleases.forEach(release => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = release.url;
    link.textContent = release.version;
    
    li.appendChild(link);
    ul.appendChild(li);
  });
}
